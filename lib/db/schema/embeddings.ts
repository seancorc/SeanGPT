import { pgTable, serial, text, integer, vector, index } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { content } from './content';

export const embeddings = pgTable('embeddings', {
  id: serial('id').primaryKey(),
  contentId: integer('content_id').references(() => content.id),
  embedding: vector('embedding', { dimensions: 3072 }).notNull(),
  chunkText: text('chunk_text').notNull(),
  title: text('title').notNull(),
  url: text('url').notNull(),
  preChunk: text('pre_chunk'),
  postChunk: text('post_chunk')
}, (table) => [{
  embeddingIndex: index('embeddingIndex').using('hnsw', table.embedding.op('vector_cosine_ops')),
  }]);

export const insertEmbeddingSchema = createInsertSchema(embeddings);
export const selectEmbeddingSchema = createSelectSchema(embeddings);