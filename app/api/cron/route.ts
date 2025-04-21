import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { embeddings as embeddingsTable } from '@/lib/db/schema/embeddings';

// Vercel cron job handler - will be executed according to the schedule in vercel.json
export async function GET(request: Request) {
  try {
    // Verify this is a legitimate cron job request from Vercel
    const authHeader = request.headers.get('Authorization');
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Simple query to keep Supabase project active
    await db.select({ count: embeddingsTable.id }).from(embeddingsTable).limit(1);
    
    return NextResponse.json({ 
      success: true, 
      message: "Supabase connection kept alive",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
