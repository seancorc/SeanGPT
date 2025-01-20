import { cosineSimilarity, embed, embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import { db } from '../db';
import { sql } from 'drizzle-orm';
import { embeddings as embeddingsTable } from '../db/schema/embeddings';
import { averageEmbeddings } from './utils';
import { split } from 'sentence-splitter';


const embeddingModel = openai.embedding('text-embedding-3-large');

// function generateChunks(text: string, chunkSize: number = 100, overlapSize: number = 10): string[] {
//     // Preprocess text
//     const cleanedText = text.replace(/\s+/g, ' ').trim();
//     // Tokenize text into words
//     const tokens = cleanedText.split(' ');
//     const chunks: string[] = [];
//     let i = 0;
//     while (i < tokens.length) {
//         // Create a chunk of the specified size
//         const chunk = tokens.slice(i, i + chunkSize).join(' ');
//         // Add the chunk to the list
//         chunks.push(chunk);
//         // Move the index forward by chunkSize - overlapSize
//         i += chunkSize - overlapSize;
//     }
//     return chunks;
// }

/**
 * Splits text into chunks based on semantic similarity between adjacent sentences & calculate embeddings for each chunk
 */
export async function generateEmbeddings(
    text: string,
    baseSimilarityThreshold = 0.22,
    maxSimilarityThreshold = 0.28,
    maxChars = 500,
    minChars = 100
  ): Promise<Array<{ chunk: string; embedding: number[] }>> {
    // 1. Split text into sentences 
    const sentences = split(text)
                    .filter((item) => item.type === 'Sentence')
                    .map((item) => item.raw.trim());
    if (sentences.length === 0) {
      return [];
    }
    // 2. Embed all sentences at once
    const { embeddings } = await embedMany({
      model: embeddingModel,
      values: sentences,
    });
    // 3. Build chunks by comparing each sentence's embedding with the current chunk's embedding
    const chunks: Array<{ chunk: string; embedding: number[] }> = [];
    // Start the first chunk with the first sentence
    let currentChunk = sentences[0];
    let currentEmbeddings = [embeddings[0]];
    for (let i = 1; i < sentences.length; i++) {
      const sentence = sentences[i];
      const sentenceEmbedding = embeddings[i];
      if (currentChunk.length < minChars) {
        currentChunk += '. ' + sentence;
        currentEmbeddings.push(sentenceEmbedding);
        continue;
      }
      // Compare to the average embedding of our current chunk
      const currentChunkEmbedding = averageEmbeddings(currentEmbeddings);
      const similarity = cosineSimilarity(currentChunkEmbedding, sentenceEmbedding);
      // Calculate how "full" our chunk is as fraction
      const fractionOfMax = Math.min(currentChunk.length / maxChars, 1);
      // Create a dynamic threshold that goes from BASE_THRESHOLD -> MAX_THRESHOLD
      // as fraction goes from 0 -> 1 but doesn't start until our chunk is50% of maxChars
      const dynamicThreshold = fractionOfMax > 0.5 ? baseSimilarityThreshold + (maxSimilarityThreshold - baseSimilarityThreshold) * fractionOfMax : baseSimilarityThreshold;
      if (currentChunk.length < maxChars && similarity >= dynamicThreshold) {
        // If it's similar enough, merge into the current chunk
        currentChunk += sentence;
        currentEmbeddings.push(sentenceEmbedding);
      } else {
        // If not, push the old chunk and start a new chunk
        // TODO: Prepend the title of the article to the chunk with "# Title: ..."
        // TODO: Add metadata to the chunk with the article title, url, prechunk & postchunk
        chunks.push({
          chunk: currentChunk,
          // re-caclulating the embedding with the new set of sentences. Expensive but most likely more accurate.
          // If want to reduce cost, we can use the averageEmbeddings function.
          embedding: await generateEmbedding(currentChunk),
        });
        currentChunk = sentence;
        currentEmbeddings = [sentenceEmbedding];
      }
    }
    // Push the final chunk
    chunks.push({
      chunk: currentChunk,
      embedding: await generateEmbedding(currentChunk), 
    });
    return chunks;
  }

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\\n', ' ');
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  try {
  const topK = await db
    .select({ // from https://docs.turso.tech/sdk/ts/orm/drizzle
      id: sql`embeddings.id`,
      distance: sql<number>`vector_distance_cos(${embeddingsTable.embedding}, vector32(${JSON.stringify(userQueryEmbedded)}))`,
      chunk: sql`embeddings.chunk`,
    })
    .from(
      sql`vector_top_k('vector_idx', vector32(${JSON.stringify(userQueryEmbedded)}), 4)`,
    )
    .leftJoin(embeddingsTable, sql`${embeddingsTable}.id = vector_top_k.id`);
    return topK;
  } catch (error) {
    console.error('Error performing nearest neighbor search:', error);
    return null;
  }

};