import { generateEmbeddings } from '@/lib/ai/embeddings_utils';
import fs from 'fs';
import { scrapeArticle } from '@/lib/scripts/scrape';

// Function to test generateEmbeddings
const testGenerateEmbeddings = async () => {
  const testText = await scrapeArticle();
  console.log('testText:', testText);
  return;
  try {
    const similarityThreshold = 0;
    const embeddings = await generateEmbeddings(testText);
    // Extract chunks from embeddings
    const chunks = embeddings.map(embedding => embedding.chunkText);
    // Write chunks to a file
    const outputFileName = `embeddings_output_similarity_${similarityThreshold}_${Date.now()}.txt`;
    fs.writeFileSync(outputFileName, chunks.join('\n NEW CHUNK \n'), 'utf8');
    console.log(`Embeddings written to ${outputFileName}`);
  } catch (error) {
    console.error('Error testing generateEmbeddings:', error);
  }
};

// Call the test function
testGenerateEmbeddings();