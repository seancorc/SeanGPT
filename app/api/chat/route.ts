import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { INITIAL_MESSAGE } from '@/lib/config';
import { findRelevantContent } from '@/lib/ai/embeddings';
import { z } from 'zod';

export async function POST(req: Request) {
  const { messages, personalInfo } = await req.json();
  const result = streamText({
    model: openai('gpt-4o'),
    messages,
    system: `${INITIAL_MESSAGE}${personalInfo ? `\n\nUser Context:\n${personalInfo}` : ''}`,
    //temperature: 0.4,
    maxTokens: 1000,
    tools: {      
      getInformation: tool({
      description: `get information from your knowledge base to answer questions. Call this tool when the user asks a question.`,
      parameters: z.object({
        question: z.string().describe('the users question'),
      }),
        execute: async ({ question }) => {
          const relevantContent = await findRelevantContent(question);
          if (!relevantContent)
            return 'No relevant content found. Say you don\'t have access to that information.';
          
          return relevantContent.map(item => item.chunk).join('\n\n');
        },
      }),
    },
  });
  return result.toDataStreamResponse();
}

