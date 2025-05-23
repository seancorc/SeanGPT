import { cosineSimilarity, embed, embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import { db } from '../db';
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import { embeddings as embeddingsTable } from '../db/schema/embeddings';
import { split } from 'sentence-splitter';


const embeddingModel = openai.embedding('text-embedding-3-large');
  /**
   * Averages multiple embedding vectors into a single vector.
   */
  function averageEmbeddings(embeddings: number[][]): number[] {
    // If there's only one embedding, return it
    if (embeddings.length === 1) return embeddings[0];
  
    const length = embeddings[0].length;
    const sumVector = new Array(length).fill(0);
  
    // Sum component-wise
    for (const emb of embeddings) {
      for (let i = 0; i < length; i++) {
        sumVector[i] += emb[i];
      }
    }
    // Divide by total number of embeddings to get average
    for (let i = 0; i < length; i++) {
      sumVector[i] /= embeddings.length;
    }
  
    return sumVector;
  }

interface Chunk {
  chunkText: string;
  embedding: number[];
  metadata: {
    title: string;
    url: string;
    preChunk?: string;
    postChunk?: string;
  };
}

/**
 * Splits text into chunks based on semantic similarity between adjacent sentences & calculate embeddings for each chunk
 */
export async function generateEmbeddings(
    text: string,
    url: string,
    title: string,
    baseSimilarityThreshold = 0.22,
    maxSimilarityThreshold = 0.28,
    maxChars = 512,
    minChars = 100
  ): Promise<Chunk[]> {
    const sentences = split(text)
                    .filter((item) => item.type === 'Sentence')
                    .map((item) => item.raw.trim());
    if (sentences.length === 0) return [];

    const { embeddings } = await embedMany({
      model: embeddingModel,
      values: sentences,
    });

    const chunks: Chunk[] = [];
    let currentText = sentences[0];
    let currentEmbeddings = [embeddings[0]];
    let previousChunk: Chunk | undefined;

    for (let i = 1; i < sentences.length; i++) {
      const sentence = sentences[i];
      const sentenceEmbedding = embeddings[i];
      if (currentText.length < minChars) {
        currentText += " " + sentence;
        currentEmbeddings.push(sentenceEmbedding);
        continue;
      }
      const currentChunkEmbedding = averageEmbeddings(currentEmbeddings);
      const similarity = cosineSimilarity(currentChunkEmbedding, sentenceEmbedding);
      const fractionOfMax = Math.min(currentText.length / maxChars, 1);
      const dynamicThreshold = fractionOfMax > 0.5 ? baseSimilarityThreshold + (maxSimilarityThreshold - baseSimilarityThreshold) * fractionOfMax : baseSimilarityThreshold;

      if (currentText.length < maxChars && similarity >= dynamicThreshold) {
        currentText += sentence;
        currentEmbeddings.push(sentenceEmbedding);
      } else {
        // Create current chunk
        const firstThreeWords = split(currentText)[0].raw.split(' ').slice(0, 3).join(' ');
        const urlFragment = encodeURIComponent(firstThreeWords);
        const urlWithFragment = `${url}#:~:text=${urlFragment}`;
        
        const currentChunk: Chunk = {
          chunkText: currentText,
          // re-caclulating the embedding with the new set of sentences. Expensive but most likely more accurate.
          // If want to reduce cost, we can use the averageEmbeddings function.
          embedding: await generateEmbedding(currentText),
          metadata: {
            title,
            url: urlWithFragment,
            preChunk: previousChunk?.chunkText,
          }
        };
        // Update previous chunk with this one as postChunk
        if (previousChunk) {
          previousChunk.metadata.postChunk = currentText;
        }
        chunks.push(currentChunk);
        previousChunk = currentChunk;
        // Start new chunk
        currentText = sentence;
        currentEmbeddings = [sentenceEmbedding];
      }
    }

    // Handle final chunk
    const firstThreeWords = split(currentText)[0].raw.split(' ').slice(0, 3).join(' ');
    const urlFragment = encodeURIComponent(firstThreeWords);
    const urlWithFragment = `${url}#:~:text=${urlFragment}`;
    const finalChunk: Chunk = {
      chunkText: currentText,
      embedding: await generateEmbedding(currentText),
      metadata: {
        title,
        url: urlWithFragment,
        preChunk: previousChunk?.chunkText,
      }
    };

    // Update previous chunk's postChunk
    if (previousChunk) {
      previousChunk.metadata.postChunk = currentText;
    }

    chunks.push(finalChunk);
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
    const similarity = sql<number>`1 - (${cosineDistance(embeddingsTable.embedding, userQueryEmbedded)})`;
    const relevantContent = await db
      .select({
        id: embeddingsTable.id,
        similarity,
        chunkText: embeddingsTable.chunkText,
        title: embeddingsTable.title,
        url: embeddingsTable.url,
        preChunk: embeddingsTable.preChunk,
        postChunk: embeddingsTable.postChunk
      })
      .from(embeddingsTable)
      .where(gt(similarity, 0.2))
      .orderBy((e) => desc(e.similarity))
      .limit(4);
      
    return relevantContent;
  } catch (error) {
    console.error('Error performing nearest neighbor search:', error);
    return null;
  }
};