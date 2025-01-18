import { execSync } from 'child_process';
import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

async function createVectorIndex() {
  try {
    await db.run(sql`
      CREATE INDEX IF NOT EXISTS vector_idx ON embeddings(libsql_vector_idx(embedding))
    `);
    console.log('Vector index created successfully');
  } catch (error) {
    console.error('Error creating vector index:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('Running schema push...');
    execSync('npm run db:push', { stdio: 'inherit' });
    
    console.log('Creating vector index...');
    await createVectorIndex();
    
    console.log('Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

main(); 