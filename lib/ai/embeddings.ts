import { embed, embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import { db } from '../db';
import { sql } from 'drizzle-orm';
import { embeddings as embeddingsTable } from '../db/schema/embeddings';

const embeddingModel = openai.embedding('text-embedding-ada-002');

const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split('.')
    .filter(i => i !== '');
};

export const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; chunk: string }>> => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ chunk: chunks[i], embedding: e }));
};

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