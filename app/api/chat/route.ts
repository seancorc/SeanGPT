import { openai } from '@ai-sdk/openai';
import { InvalidToolArgumentsError, NoSuchToolError, streamText, tool, ToolExecutionError } from 'ai';
import { INITIAL_MESSAGE } from '@/lib/config';
import { findRelevantContent } from '@/lib/ai/embeddings_utils';
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
      description: `Get information from your knowledge base to answer questions. Call this tool when the user asks a question.`,
      parameters: z.object({
        question: z.string().describe('the users question'),
      }),
        execute: async ({ question }) => {
          const relevantContent = await findRelevantContent(question);
          if (!relevantContent)
            return 'No relevant information found.';
          
          const formattedContent = relevantContent.map(item => `# ${item.title}
            // TODO: Find a better way to insert the right sized prechunk & postchunk content
            // Put the references as part of the response
            ${item.preChunk ? `${item.preChunk.slice(-100)}\n` : ''}${item.chunkText}${item.postChunk ? `\n${item.postChunk.slice(0, 100)}` : ''}
            Source: ${item.url}`).join('\n\n---\n\n');
          
          console.log('formattedContent:', formattedContent);
          return formattedContent;
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

