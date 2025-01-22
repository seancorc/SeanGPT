import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';
import { sql } from 'drizzle-orm';

export const content = sqliteTable('content', {
	id: integer('id').primaryKey(),
	text_data: text('text_data').notNull(),
	url: text('url').notNull(),
	source_type: text('source_type').notNull(), // e.g., 'webpage', 'tweet', ...
	metadata: text('metadata', { mode: 'json' }), // Store source-specific metadata as JSON
	created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertContentSchema = createInsertSchema(content);