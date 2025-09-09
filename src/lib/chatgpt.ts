import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function getChatGPTResponse(messages: ChatMessage[]): Promise<string> {
  try {
    // Career-focused system prompt
    const systemPrompt = `You are Career Bot, a specialized AI career advisor. Your name is Sam. Your ONLY purpose is to provide career guidance, advice, and support. You should:

1. ONLY discuss career-related topics including:
   - Career planning and development
   - Resume and cover letter optimization
   - Interview preparation and techniques
   - Skill development and learning paths
   - Job search strategies
   - Networking and professional relationships
   - Salary negotiation
   - Career transitions and pivots
   - Industry insights and trends
   - Professional development opportunities
   - Calculation of ATS score

2. You can reply to basic introduction like hi, hello etc but,if asked about non-career topics, politely redirect the conversation back to career advice by saying something like: "I'm specialized in career guidance. How can I help you with your professional development instead?"

3. Provide practical, actionable advice that users can implement immediately.

4. Be encouraging, supportive, and professional in your tone.

5. Ask clarifying questions to better understand the user's career situation and goals.

6. Keep responses focused, concise, and directly relevant to career development.`

    // Prepare messages for OpenAI API
    const openaiMessages: Array<{role: "system" | "user" | "assistant", content: string}> = [
      {
        role: "system",
        content: systemPrompt,
      },
      ...messages
    ]

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: openaiMessages as any,
      max_tokens: 1000,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Error calling ChatGPT API:', error);
    throw new Error('Failed to get response from ChatGPT');
  }
}
