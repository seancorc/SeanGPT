import { pgTable, serial, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

export const content = pgTable('content', {
	id: serial('id').primaryKey(),
	text_data: text('text_data').notNull(),
	url: text('url').notNull(),
	source_type: text('source_type').notNull(), // e.g., 'webpage', 'tweet', ...
	metadata: jsonb('metadata'), // Store source-specific metadata as JSON
	created_at: timestamp('created_at').notNull().defaultNow(),
});

export const insertContentSchema = createInsertSchema(content);