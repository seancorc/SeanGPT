import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { content, insertContentSchema } from '@/lib/db/schema/content';
import { generateEmbeddings } from '@/lib/ai/embeddings';
import { embeddings as embeddingsTable } from '@/lib/db/schema/embeddings';
import { sql } from 'drizzle-orm';

export async function POST(req: Request) {
    const validatedData = insertContentSchema.parse(await req.json());
    const [result] = await db
        .insert(content)
        .values({ text_data: validatedData.text_data })
        .returning({ id: content.id });

    const embeddings = await generateEmbeddings(validatedData.text_data);
    await db.insert(embeddingsTable).values(
        embeddings.map(embedding => ({
          contentId: result.id,
          chunk: embedding.chunk,
          embedding: sql`vector32(${JSON.stringify(embedding.embedding)})`,
        })),
    );

    return NextResponse.json(result);
}