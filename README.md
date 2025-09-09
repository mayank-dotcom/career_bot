# 🤖 Career Bot - AI Career Assistant

A modern, full-stack career counseling chatbot built with Next.js, tRPC, TanStack Query, Prisma, and OpenAI ChatGPT API integration. This application provides personalized career guidance, resume analysis, and professional development advice through an intuitive chat interface.

## ✨ Features

### 🎯 Core Functionality
- **🤖 AI-Powered Career Counseling**: Specialized AI assistant (Sam) focused exclusively on career guidance
- **💬 Real-time Chat Interface**: Instant responses with full conversation history
- **📱 Responsive Design**: Optimized for both mobile and desktop experiences
- **🔐 Secure Authentication**: JWT-based user authentication with bcrypt password hashing
- **💾 Persistent Storage**: PostgreSQL database with Prisma ORM for reliable data persistence
- **⚡ Type-Safe API**: Full-stack TypeScript with tRPC for end-to-end type safety
- **🔄 Optimistic Updates**: Smooth UX with TanStack Query for instant feedback

### 🎨 Advanced UI/UX Features
- **🌙 Dark/Light Theme Toggle**: Seamless theme switching with persistent preferences
- **📊 Message Status Indicators**: Real-time message delivery and read status
- **⌨️ Typing Indicators**: Visual feedback during AI response generation
- **📱 Mobile-First Design**: Collapsible sidebar and touch-optimized interface
- **🎭 Loading States**: Comprehensive loading indicators and skeleton screens
- **🚨 Error Handling**: Graceful error management with user-friendly notifications

### 🔒 Security & Authentication
- **🔐 JWT Token Authentication**: Secure session management with 7-day expiration
- **🛡️ Password Security**: bcryptjs hashing with 12 rounds for maximum security
- **✅ Input Validation**: Server-side validation for all user inputs
- **🔒 Protected Routes**: Authentication-required access to chat functionality
- **📝 Session Persistence**: Automatic login state restoration across browser sessions

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.5.2** - React framework with App Router
- **React 19.1.0** - Latest React with concurrent features
- **TypeScript 5** - Strict type checking and enhanced developer experience
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful, customizable icons

### Backend & API
- **tRPC 11.5.1** - End-to-end typesafe APIs
- **TanStack Query 5.87.1** - Powerful data synchronization for React
- **Zod 4.1.5** - TypeScript-first schema validation

### Database & ORM
- **PostgreSQL** - Robust, open-source relational database
- **Prisma 6.15.0** - Next-generation ORM with type safety
- **Database Migrations** - Version-controlled schema changes

### AI & External Services
- **OpenAI GPT-3.5-turbo** - Advanced language model for career counseling

### Development Tools
- **ESLint** - Code linting and quality assurance
- **Turbopack** - Fast bundler for development
- **Hot Toast** - Beautiful notification system

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** - JavaScript runtime
- **PostgreSQL** - Database server
- **OpenAI API Key** - For AI functionality
- **Git** - Version control

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd career_bot/frontend
```

### 2. Install Dependencies
```bash
npm i --legacy-peer-deps
```

### 3. Environment Configuration

Create a `.env.local` file in the `frontend` directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/career_bot"

# OpenAI API Configuration
OPENAI_API_KEY="your_openai_api_key_here"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Optional: Development Database (if different from production)
# DATABASE_URL_DEV="postgresql://username:password@localhost:5432/career_bot_dev"
```

### 4. Database Setup

#### Local PostgreSQL Setup
1. **Install PostgreSQL** on your system
2. **Create Database**:
   ```sql
   CREATE DATABASE career_bot;
   ```
3. **Update DATABASE_URL** in your `.env.local` file with your credentials

#### Alternative: Use a Cloud Database
- **Neon** (Recommended): [neon.tech](https://neon.tech)
- **Supabase**: [supabase.com](https://supabase.com)
- **Railway**: [railway.app](https://railway.app)

### 5. Database Migration
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Optional: Seed the database
npx prisma db seed
```

### 6. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 📱 Usage Guide

### Getting Started
1. **Sign Up**: Create a new account with your email and password
2. **Sign In**: Use your credentials to access the application
3. **Create Chat**: Click "New Chat" to start a conversation
4. **Chat with Sam**: Ask career-related questions and get personalized advice
5. **View History**: Access previous conversations from the sidebar

### Career Counseling Features
- **Resume Analysis**: Upload your resume for personalized feedback
- **Career Planning**: Get guidance on career paths and transitions
- **Interview Preparation**: Practice questions and get tips
- **Skill Development**: Identify gaps and learning opportunities
- **Job Search Strategy**: Optimize your job search approach
- **Salary Negotiation**: Get advice on compensation discussions

### Chat Management
- **Session Persistence**: Conversations are automatically saved
- **Chat History**: View and continue previous conversations
- **Message Status**: Track message delivery and read status
- **Theme Customization**: Switch between light and dark modes

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   └── trpc/          # tRPC API handler
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── auth/              # Authentication components
│   │   │   └── AuthForm.tsx   # Login/signup form
│   │   ├── chat/              # Chat-specific components
│   │   │   ├── ChatBot.tsx    # Main chat interface
│   │   │   ├── ChatInterface.tsx # Message display
│   │   │   ├── ChatList.tsx   # Chat history sidebar
│   │   │   ├── InputBar.tsx   # Message input
│   │   │   ├── MessageBubble.tsx # Individual messages
│   │   │   ├── MessageStatus.tsx # Status indicators
│   │   │   └── TypingIndicator.tsx # Loading animation
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── button.tsx     # Button component
│   │   │   ├── card.tsx       # Card component
│   │   │   ├── input.tsx      # Input component
│   │   │   ├── label.tsx      # Label component
│   │   │   ├── skeleton.tsx   # Loading skeleton
│   │   │   └── theme-toggle.tsx # Theme switcher
│   │   └── providers.tsx      # Context providers
│   ├── contexts/              # React contexts
│   │   └── ThemeContext.tsx   # Theme management
│   ├── hooks/                 # Custom React hooks
│   │   └── useMessageStatus.ts # Message status hook
│   ├── lib/                   # Utility functions
│   │   ├── chatgpt.ts         # OpenAI API integration
│   │   ├── prisma.ts          # Database client
│   │   └── utils.ts           # General utilities
│   ├── trpc/                  # tRPC configuration
│   │   ├── client.ts          # Client configuration
│   │   ├── conf.ts            # Server configuration
│   │   └── index.ts           # API router
│   └── generated/             # Generated files
│       └── prisma/            # Prisma client
├── prisma/                    # Database schema
│   ├── migrations/            # Database migrations
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── test/                      # Test files
│   └── data/                  # Test data
├── components.json            # Shadcn/ui configuration
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies
├── tailwind.config.js         # Tailwind configuration
└── tsconfig.json              # TypeScript configuration
```

## 🗄️ Database Schema

### User Model
```prisma
model User {
  id               String    @id
  email            String    @unique
  password         String
  name             String?
  isSubscribed     Boolean   @default(false)
  subscriptionEnds DateTime?
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  todos            Todo[]
  chats            Chat[]
}
```

### Chat Model
```prisma
model Chat {
  id        String    @id @default(cuid())
  title     String    @default("New Chat")
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  user      User      @relation(fields: [userId], references: [id])
  userId    String
  messages  Message[]
}
```

### Message Model
```prisma
model Message {
  id        String   @id @default(cuid())
  content   String
  role      String   // "user" or "assistant"
  status    String?  // "sent", "delivered", "read", "error"
  createdAt DateTime @default(now())
  chat      Chat     @relation(fields: [chatId], references: [id], onDelete: Cascade)
  chatId    String
}
```

## 🔌 API Endpoints

### Authentication
- `signup` - Create a new user account
- `signin` - Authenticate existing user
- `getCurrentUser` - Get current user information

### Chat Management
- `createChat` - Create a new chat session
- `getChats` - Get all chats for a user
- `getMessages` - Get messages for a specific chat
- `sendMessage` - Send a message and get AI response
- `updateMessageStatus` - Update message delivery status

### User Management
- `getUserById` - Get user by ID
- `updateUser` - Update user information

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Configure Environment Variables** in Vercel Dashboard:
   - `DATABASE_URL` - Your production database URL
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `JWT_SECRET` - A secure random string

### Production Database Setup

#### Option 1: Neon (Recommended)
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add to Vercel environment variables

#### Option 2: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get the database URL from Settings > Database
4. Add to Vercel environment variables

#### Option 3: Railway
1. Go to [railway.app](https://railway.app)
2. Create a new PostgreSQL service
3. Copy the connection string
4. Add to Vercel environment variables

### Database Migration in Production
```bash
# Set production database URL
export DATABASE_URL="your-production-database-url"

# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

### Environment Variables for Production
```env
# Required
DATABASE_URL="postgresql://username:password@host:port/database"
OPENAI_API_KEY="sk-your-openai-api-key"
JWT_SECRET="your-super-secure-jwt-secret"

# Optional
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Chat creation and message sending
- [ ] Message history and persistence
- [ ] Theme switching (dark/light mode)
- [ ] Mobile responsiveness
- [ ] Error handling and edge cases
- [ ] Database connectivity
- [ ] AI response generation

### Automated Testing
```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit

# Build verification
npm run build
```

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Commands
```bash
npx prisma studio           # Open Prisma Studio
npx prisma migrate dev      # Create and apply migration
npx prisma migrate reset    # Reset database
npx prisma generate         # Generate Prisma client
npx prisma db push          # Push schema changes
```

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured with Next.js rules
- **Prettier**: Code formatting (if configured)
- **Husky**: Git hooks for quality assurance (if configured)

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check database connection
npx prisma db pull

# Reset database
npx prisma migrate reset
```

#### Environment Variables
- Ensure all required environment variables are set
- Check for typos in variable names
- Verify API keys are valid and have proper permissions

#### Build Issues
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm i --legacy-peer-deps
```

#### OpenAI API Issues
- Verify API key is correct
- Check API usage limits
- Ensure sufficient credits in OpenAI account

### Getting Help
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Review the [Discussions](https://github.com/your-repo/discussions) section
3. Create a new issue with detailed information

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, email support@your-domain.com or create an issue in the repository.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [tRPC](https://trpc.io/) - End-to-end typesafe APIs
- [Prisma](https://prisma.io/) - Database ORM
- [OpenAI](https://openai.com/) - AI language models
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://radix-ui.com/) - Component primitives

---

**Built with ❤️ for career development and professional growth.**