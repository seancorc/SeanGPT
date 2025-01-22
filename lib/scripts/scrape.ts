import { generateEmbeddings } from '@/lib/ai/embeddings_utils';
import { db } from '@/lib/db';
import { content } from '@/lib/db/schema/content';
import { embeddings } from '@/lib/db/schema/embeddings';
import fetch from 'node-fetch';
import { eq } from 'drizzle-orm';

interface WebpageConfig {
  url: string;
  startMarker: string;
  endMarker: string;
  metadata?: {
    title: string;
    author?: string;
    category?: string;
    [key: string]: any;
  };
}

const ARTICLES: WebpageConfig[] = [
  {
    url: 'https://www.seancorc.com/writing/alcolyte-lessons',
    startMarker: 'For context - This message was sent out',
    endMarker: '424-634-9101',
    metadata: {
      title: 'Alcolyte Lessons',
      author: 'Sean Corcoran',
      category: 'career'
    }
  },
  {
    url: 'https://www.seancorc.com/writing/health-and-fitness',
    startMarker: 'Health',
    endMarker: 'figure it all out.',
    metadata: {
      title: 'Health and Fitness',
      author: 'Sean Corcoran',
      category: 'health'
    }
  },
  {
    url: 'https://blog.samaltman.com/how-to-be-successful',
    startMarker: 'How To Be Successful',
    endMarker: 'born incredibly lucky.',
    metadata: {
      title: 'How To Be Successful',
      author: 'Sam Altman',
      category: 'career'
    }
  },
  {
    url: 'https://markmanson.net/question',
    startMarker: 'The Most Important Question',
    endMarker: 'choose your struggles wisely.',
    metadata: {
      title: 'The Most Important Question',
      author: 'Mark Manson',
      category: 'philosophy'
    }
  },
  {
    url: 'https://www.paulgraham.com/wealth.html',
    startMarker: 'If you wanted to get rich',
    endMarker: 'and you rule the world.',
    metadata: {
      title: 'How to Make Wealth',
      author: 'Paul Graham',
      category: 'career'
    }
  },
  {
    url: 'https://www.grahamweaver.com/blog/2023-stanford-graduate-school-of-business-last-lecture',
    startMarker: 'How to Live an Asymmetric Life',
    endMarker: 'You came this far to move the world. Now is your time.',
    metadata: {
      title: 'How to Live an Asymmetric Life',
      author: 'Graham Weaver',
      category: 'philosophy'
    }
  },
  {
    url: 'https://www.seancorc.com/writing/internal/random-tidbits',
    startMarker: 'Health',
    endMarker: 'COMPLACENT',
    metadata: {
      title: 'Random Tidbits',
      author: 'Sean Corcoran',
      category: 'misc'
    }
  },
  {
    url: 'https://www.seancorc.com/writing/internal/high-output-individual',
    startMarker: 'How to be a high output individual',
    endMarker: 'distractions.',
    metadata: {
      title: 'How To Be A High Output Individual',
      author: 'Sean Corcoran',
      category: 'career'
    }
  }
];

async function cleanText(text: string): Promise<string> {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&eacute;/g, 'é')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

async function checkExistingContent(url: string): Promise<boolean> {
  const existing = await db
    .select({ id: content.id })
    .from(content)
    .where(eq(content.url, url))
    .limit(1);
  
  return existing.length > 0;
}

export async function scrapeWebpage(config: WebpageConfig): Promise<string> {
  try {
    const response = await fetch(config.url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    const startIndex = text.indexOf(config.startMarker);
    const endIndex = text.indexOf(config.endMarker);
    
    if (startIndex === -1 || endIndex === -1) {
      throw new Error(`Start or end marker not found in content for ${config.url}`);
    }
    
    const content = text.slice(
      startIndex,
      endIndex + config.endMarker.length
    );

    return cleanText(content);
  } catch (error) {
    console.error(`Error scraping webpage ${config.url}:`, error);
    throw error;
  }
}

async function processArticle(config: WebpageConfig) {
  try {
    console.log(`\nProcessing article: ${config.metadata?.title}`);
    
    // Check if content already exists
    const exists = await checkExistingContent(config.url);
    if (exists) {
      console.log(`Skipping article: Content from ${config.url} already exists in database`);
      return true;
    }
    
    console.log('Scraping webpage...');
    const scrapedContent = await scrapeWebpage(config);
    
    // Insert the content
    const [insertedContent] = await db
      .insert(content)
      .values({
        text_data: scrapedContent,
        url: config.url,
        source_type: 'webpage',
        metadata: config.metadata
      })
      .returning();

    console.log('Content inserted with ID:', insertedContent.id);

    // Generate embeddings for the content
    const chunks = await generateEmbeddings(scrapedContent, config.url, config.metadata?.title || '');
    console.log(`Generated ${chunks.length} chunks with embeddings`);

    // Insert embeddings with metadata
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

    console.log('Successfully processed article');
    return true;
  } catch (error) {
    console.error(`Failed to process article ${config.url}:`, error);
    return false;
  }
}

async function main() {
  try {
    console.log('Starting article processing...');
    let successCount = 0;
    let failureCount = 0;
    let skippedCount = 0;

    for (const article of ARTICLES) {
      const exists = await checkExistingContent(article.url);
      if (exists) {
        console.log(`\nSkipping article: ${article.metadata?.title} - Already exists in database`);
        skippedCount++;
        continue;
      }

      const success = await processArticle(article);
      if (success) {
        successCount++;
      } else {
        failureCount++;
      }
    }

    console.log('\nProcessing complete!');
    console.log(`Successfully processed: ${successCount} articles`);
    console.log(`Failed to process: ${failureCount} articles`);
    console.log(`Skipped (already exists): ${skippedCount} articles`);
    
    process.exit(failureCount > 0 ? 1 : 0);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
