import { OpenAI } from 'openai';
import { StreamingTextResponse, OpenAIStream } from 'ai';
import { SEAN_FITNESS_KNOWLEDGE, OPENAI_CONFIG } from '@/lib/config';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages, personalInfo } = await req.json();

  // Create the system message with Sean's fitness knowledge
  const systemMessage = {
    role: "system",
    content: `${SEAN_FITNESS_KNOWLEDGE}${personalInfo ? `\n\nUser Context:\n${personalInfo}` : ''}`
  };

  // Add the system message to the beginning of the messages array
  const augmentedMessages = [systemMessage, ...messages];

  // Ask OpenAI for a streaming chat completion
  const response = await openai.chat.completions.create({
    ...OPENAI_CONFIG,
    messages: augmentedMessages as any,
    stream: true,
  });

  // Create a stream of the response
  const stream = OpenAIStream(response as any);

  // Return a StreamingTextResponse, which can be consumed by the client
  return new StreamingTextResponse(stream);
} 