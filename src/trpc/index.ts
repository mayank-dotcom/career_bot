import { publicProcedure,router } from "./conf";
import prisma from "../lib/prisma";
import { z } from "zod";
import { getChatGPTResponse, type ChatMessage } from "../lib/chatgpt";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const appRouter = router({
   
    signup: publicProcedure
        .input(z.object({
            email: z.string().email(),
            password: z.string().min(6, "Password must be at least 6 characters"),
            name: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email: input.email },
            });

            if (existingUser) {
                throw new Error("User with this email already exists");
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(input.password, 12);

            // Create user
            const user = await prisma.user.create({
                data: {
                    id: crypto.randomUUID(),
                    email: input.email,
                    password: hashedPassword,
                    name: input.name,
                },
            });

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET || "fallback-secret",
                { expiresIn: "7d" }
            );

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    isSubscribed: user.isSubscribed,
                },
                token,
            };
        }),

    signin: publicProcedure
        .input(z.object({
            email: z.string().email(),
            password: z.string(),
        }))
        .mutation(async ({ input }) => {
            // Find user by email
            const user = await prisma.user.findUnique({
                where: { email: input.email },
            });

            if (!user) {
                throw new Error("Invalid email or password");
            }

            // Verify password
            const isValidPassword = await bcrypt.compare(input.password, user.password);

            if (!isValidPassword) {
                throw new Error("Invalid email or password");
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET || "fallback-secret",
                { expiresIn: "7d" }
            );

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    isSubscribed: user.isSubscribed,
                },
                token,
            };
        }),

    getCurrentUser: publicProcedure
        .input(z.object({
            token: z.string(),
        }))
        .query(async ({ input }) => {
            try {
                // Verify JWT token
                const decoded = jwt.verify(input.token, process.env.JWT_SECRET || "fallback-secret") as any;
                
                // Get user from database
                const user = await prisma.user.findUnique({
                    where: { id: decoded.userId },
                });

                if (!user) {
                    throw new Error("User not found");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    isSubscribed: user.isSubscribed,
                };
            } catch (error) {
                throw new Error("Invalid or expired token");
            }
        }),

     

updateUser:publicProcedure.input(z.object({
  id:z.string(),
  email:z.string().email(),
})).mutation(async ({ input }) => {
  const user = await prisma.user.update({where:{id:input.id},data:{email:input.email}})
  return user
}),

// Chat procedures
createChat: publicProcedure
  .input(z.object({
    userId: z.string(),
    title: z.string().optional(),
  }))
  .mutation(async ({ input }) => {
    // First, verify that the user exists
    const user = await prisma.user.findUnique({
      where: { id: input.userId },
    });

    if (!user) {
      throw new Error(`User with ID ${input.userId} not found`);
    }

    const chat = await prisma.chat.create({
      data: {
        userId: input.userId,
        title: input.title || "New Chat",
      },
    });
    return chat;
  }),

getUserById: publicProcedure
  .input(z.object({
    userId: z.string(),
  }))
  .query(async ({ input }) => {
    const user = await prisma.user.findUnique({
      where: { id: input.userId },
    });
    return user;
  }),

getChats: publicProcedure
  .input(z.object({
    userId: z.string(),
  }))
  .query(async ({ input }) => {
    // First, verify that the user exists
    const user = await prisma.user.findUnique({
      where: { id: input.userId },
    });

    if (!user) {
      throw new Error(`User with ID ${input.userId} not found`);
    }

    const chats = await prisma.chat.findMany({
      where: { userId: input.userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    return chats;
  }),

getMessages: publicProcedure
  .input(z.object({
    chatId: z.string(),
  }))
  .query(async ({ input }) => {
    const messages = await prisma.message.findMany({
      where: { chatId: input.chatId },
      orderBy: { createdAt: 'asc' },
    });
    return messages;
  }),

sendMessage: publicProcedure
  .input(z.object({
    chatId: z.string(),
    content: z.string(),
    userId: z.string(),
  }))
  .mutation(async ({ input }) => {
    // Save user message with initial status
    const userMessage = await prisma.message.create({
      data: {
        chatId: input.chatId,
        content: input.content,
        role: 'user',
        status: 'sent',
      },
    });

    // Get chat history for context
    const chatHistory = await prisma.message.findMany({
      where: { chatId: input.chatId },
      orderBy: { createdAt: 'asc' },
    });

    // Convert to ChatGPT format
    const messages: ChatMessage[] = chatHistory.map((msg: any) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    try {
      // Get response from ChatGPT
      const aiResponse = await getChatGPTResponse(messages);

      // Save AI response
      const aiMessage = await prisma.message.create({
        data: {
          chatId: input.chatId,
          content: aiResponse,
          role: 'assistant',
        },
      });

      // Update chat timestamp
      await prisma.chat.update({
        where: { id: input.chatId },
        data: { updatedAt: new Date() },
      });

      return {
        userMessage,
        aiMessage,
      };
    } catch (error) {
      console.error('Error getting AI response:', error);
      throw new Error('Failed to get AI response');
    }
  }),

updateMessageStatus: publicProcedure
  .input(z.object({
    messageId: z.string(),
    status: z.enum(['sent', 'delivered', 'read', 'error']),
  }))
  .mutation(async ({ input }) => {
    const message = await prisma.message.update({
      where: { id: input.messageId },
      data: { status: input.status },
    });
    return message;
  }),
})
export type AppRouter = typeof appRouter;