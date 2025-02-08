import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function uploadTrainingFile() {
  const trainingFile = path.join(process.cwd(), 'training-data', 'training.jsonl');
  
  if (!fs.existsSync(trainingFile)) {
    throw new Error('Training file not found. Please run prepare-training-data.ts first.');
  }

  console.log('Uploading training file...');
  const file = await openai.files.create({
    file: fs.createReadStream(trainingFile),
    purpose: 'fine-tune',
  });

  console.log('File uploaded successfully. File ID:', file.id);
  return file.id;
}

async function createFineTuningJob(fileId: string) {
  console.log('Creating fine-tuning job...');
  
  const fineTune = await openai.fineTuning.jobs.create({
    training_file: fileId,
    model: 'gpt-3.5-turbo-1106',
    hyperparameters: {
      n_epochs: 3,
    },
  });

  console.log('Fine-tuning job created successfully. Job ID:', fineTune.id);
  return fineTune.id;
}

async function monitorFineTuningJob(jobId: string) {
  console.log('Monitoring fine-tuning job...');
  
  while (true) {
    const job = await openai.fineTuning.jobs.retrieve(jobId);
    console.log('Status:', job.status);
    
    if (job.status === 'succeeded') {
      console.log('Fine-tuning complete!');
      console.log('Fine-tuned model ID:', job.fine_tuned_model);
      break;
    } else if (job.status === 'failed') {
      console.error('Fine-tuning failed:', job.error);
      throw new Error('Fine-tuning failed');
    }
    
    // Wait 60 seconds before checking again
    await new Promise(resolve => setTimeout(resolve, 60000));
  }
}

async function main() {
  try {
    // 1. Upload training file
    const fileId = await uploadTrainingFile();
    
    // 2. Create fine-tuning job
    const jobId = await createFineTuningJob(fileId);
    
    // 3. Monitor progress
    await monitorFineTuningJob(jobId);
    
    process.exit(0);
  } catch (error) {
    console.error('Error during fine-tuning:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
} 