import { db } from '@/lib/db';
import { content } from '@/lib/db/schema/content';
import { eq, sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

interface ConversationExample {
  messages: {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }[];
}

const SYSTEM_PROMPT = `You are Sean, a software engineer and entrepreneur with expertise in fitness, health, and building successful companies. 
You have a direct, no-nonsense communication style and focus on practical, actionable advice.
You often draw from your personal experiences in fitness, startups, and software engineering.
Keep responses concise and focused on what actually works based on real experience.`;

async function getSeanContent() {
  // Get all content written by Sean
  const seanContent = await db
    .select()
    .from(content)
    .where(
      sql`json_extract(${content.metadata}, '$.author') = 'Sean Corcoran'`
    );

  return seanContent;
}

function generateQuestions(text: string): string[] {
  // Split content into paragraphs
  const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
  
  const questions: string[] = [];
  
  for (const paragraph of paragraphs) {
    // Generate a relevant question for each substantial paragraph
    if (paragraph.length < 50) continue; // Skip short paragraphs
    
    // Extract topic and create question
    const firstSentence = paragraph.split('.')[0];
    const topic = firstSentence.toLowerCase();
    
    if (topic.includes('how')) {
      questions.push(topic + '?');
    } else if (topic.includes('why')) {
      questions.push(topic + '?');
    } else {
      // Create a "what" or "how" question based on the content
      if (topic.includes('best') || topic.includes('top') || topic.includes('key')) {
        questions.push(`What are the ${topic}?`);
      } else {
        questions.push(`Can you explain ${topic}?`);
      }
    }
  }
  
  return questions;
}

async function createTrainingData() {
  const seanContent = await getSeanContent();
  const conversations: ConversationExample[] = [];
  
  for (const article of seanContent) {
    const questions = generateQuestions(article.text_data);
    
    // Split content into chunks that could be reasonable responses
    const paragraphs = article.text_data.split('\n\n')
      .filter(p => p.trim().length > 50); // Only use substantial paragraphs
    
    // Create conversation examples
    for (let i = 0; i < Math.min(questions.length, paragraphs.length); i++) {
      conversations.push({
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: questions[i]
          },
          {
            role: 'assistant',
            content: paragraphs[i]
          }
        ]
      });
    }
  }
  
  // Save training data
  const outputDir = path.join(process.cwd(), 'training-data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  
  const outputPath = path.join(outputDir, 'training.jsonl');
  const stream = fs.createWriteStream(outputPath);
  
  for (const conversation of conversations) {
    stream.write(JSON.stringify(conversation) + '\n');
  }
  
  stream.end();
  
  console.log(`Created ${conversations.length} training examples`);
  console.log(`Training data saved to: ${outputPath}`);
  
  // Print a few examples
  console.log('\nExample training conversations:');
  conversations.slice(0, 3).forEach((conv, i) => {
    console.log(`\nExample ${i + 1}:`);
    console.log('Question:', conv.messages[1].content);
    console.log('Answer:', conv.messages[2].content);
  });
}

async function main() {
  try {
    await createTrainingData();
    process.exit(0);
  } catch (error) {
    console.error('Error creating training data:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
} 