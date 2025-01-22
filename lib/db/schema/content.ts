import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';

export const content = sqliteTable('content', {
	id: integer('id').primaryKey(),
	text_data: text('text_data').notNull(),
	url: text('url').notNull()
});
export const insertContentSchema = createInsertSchema(content);