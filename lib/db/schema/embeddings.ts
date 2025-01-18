import { integer, sqliteTable, text, index } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { content } from './content';
import { customType } from "drizzle-orm/sqlite-core";
import { sql } from 'drizzle-orm';
import { db } from '..';

const float32Array = customType<{
  data: number[];
  config: { dimensions: number };
  configRequired: true;
  driverData: Buffer;
}>({
  dataType(config) {
    return `F32_BLOB(${config.dimensions})`;
  },
  fromDriver(value: Buffer) {
    return Array.from(new Float32Array(value.buffer));
  },
  toDriver(value: number[]) {
    return sql`vector32(${JSON.stringify(value)})`;
  },
});

export const embeddings = sqliteTable('embeddings', {
  id: integer('id').primaryKey(),
  contentId: integer('content_id').references(() => content.id),
  embedding: float32Array("embedding", { dimensions: 1536 }).notNull(), // see: https://docs.turso.tech/sdk/ts/orm/drizzle
  chunk: text('chunk').notNull()
});

export const insertEmbeddingSchema = createInsertSchema(embeddings);
export const selectEmbeddingSchema = createSelectSchema(embeddings);
