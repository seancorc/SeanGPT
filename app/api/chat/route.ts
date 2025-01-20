import { openai } from '@ai-sdk/openai';
import { InvalidToolArgumentsError, NoSuchToolError, streamText, tool, ToolExecutionError } from 'ai';
import { INITIAL_MESSAGE } from '@/lib/config';
import { findRelevantContent } from '@/lib/ai/embeddings';
import { z } from 'zod';

export async function POST(req: Request) {
  const { messages, personalInfo } = await req.json();
  const result = streamText({
    model: openai('gpt-4o'),
    messages,
    system: `${INITIAL_MESSAGE}${personalInfo ? `\n\nUser Context:\n${personalInfo}` : ''}`,
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
          
          // TODO: have each chunk be # Title \n prechunk[-400:] \n chunk \n postchunk[:400]
          const content = relevantContent.map(item => item.chunk).join('\n\n');
          console.log('content:', content);
          return content;
        },
      }),
    },
  });
  return  result.toDataStreamResponse({
    getErrorMessage: error => {
      if (NoSuchToolError.isInstance(error)) {
        return 'Sorry, I tried to call an unknown tool and that broke me.';
      } else if (InvalidToolArgumentsError.isInstance(error)) {
        return 'Sorry, I called a tool with invalid arguments and that broke me.';
      } else if (ToolExecutionError.isInstance(error)) {
        return 'Sorry, I called a tool and an unknown error occurred which broke me.';
      } else {
        return 'Sorry, I got an error & I\'m not sure what it was.';
      }
    }
  });
}

