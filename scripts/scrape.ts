import { generateEmbeddings } from '../lib/ai/embeddings_utils';
import { db } from '../lib/db';
import { content } from '../lib/db/schema/content';
import { embeddings } from '../lib/db/schema/embeddings';
import fetch from 'node-fetch';

export async function scrapeArticle() {
  try {
    const response = await fetch('https://www.seancorc.com/writing/health-and-fitness');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    
    // Extract content between the first and last paragraph
    const startMarker = "Cutting Through the Noise";
    const endMarker = "Don't take things too seriously. We're just monkey people on a wet rock flying through space trying to figure it all out.";
    
    let content = html.split(startMarker)[1].split(endMarker)[0];
    content = startMarker + content + endMarker;
    
    // Clean up HTML entities and special characters
    return content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/&amp;/g, '&') // Replace &amp; with &
      .replace(/&rsquo;/g, "'") // Replace &rsquo; with '
      .replace(/&ldquo;/g, '"') // Replace &ldquo; with "
      .replace(/&rdquo;/g, '"') // Replace &rdquo; with "
      .replace(/&eacute;/g, 'é') // Replace &eacute; with é
      .replace(/&#39;/g, "'") // Replace &#39; with '
      .replace(/&lt;/g, '<') // Replace &lt; with <
      .replace(/&gt;/g, '>') // Replace &gt; with >
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\(self\.__next.*$/, '') // Remove Next.js script content
      .trim();
  } catch (error) {
    console.error('Error scraping article:', error);
    throw error;
  }
}

async function main() {
  try {
    // 1. Scrape the content
    console.log('Scraping article...');
    const articleContent = await scrapeArticle();
    
    // 2. Insert the content
    const [insertedContent] = await db
      .insert(content)
      .values({
        text_data: articleContent
      })
      .returning();

    console.log('Content inserted with ID:', insertedContent.id);

    // 3. Generate embeddings for the content
    const chunks = await generateEmbeddings(articleContent);
    console.log(`Generated ${chunks.length} chunks with embeddings`);

    // 4. Insert embeddings with metadata
    for (const chunk of chunks) {
      await db.insert(embeddings).values({
        contentId: insertedContent.id,
        chunkText: chunk.chunkText,
        embedding: chunk.embedding,
        title: chunk.metadata.title,
        url: chunk.metadata.url,
        preChunk: chunk.metadata.preChunk,
        postChunk: chunk.metadata.postChunk
      });
    }

    console.log('Successfully generated and stored embeddings');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
