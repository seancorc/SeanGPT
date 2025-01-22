import { openai } from '@ai-sdk/openai';
import { InvalidToolArgumentsError, NoSuchToolError, streamText, tool, ToolExecutionError } from 'ai';
import { INITIAL_MESSAGE } from '@/lib/config';
import { findRelevantContent } from '@/lib/ai/embeddings_utils';
import { z } from 'zod';
import { split } from 'sentence-splitter';

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
          
          const formattedContent = relevantContent.map(chunk => {
            const previousSentence = split(chunk.preChunk || '')
                    .map((chunkText) => chunkText.raw.trim()).at(-1);
            const nextSentence = split(chunk.postChunk || '')
                    .map((chunkText) => chunkText.raw.trim()).at(0);
            return `# ${chunk.title}
            ${previousSentence ? `${previousSentence}\n` : ''}${chunk.chunkText}${nextSentence ? `\n${nextSentence}` : ''}
            Source: ${chunk.url}`;
          }).join('\n\n---\n\n');
          
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

