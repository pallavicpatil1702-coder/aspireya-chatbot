import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
  console.error('GROQ_API_KEY is not configured in .env. Skipping real API test.');
  process.exit(1);
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

console.log('Sending request to Groq API with llama-3.3-70b-versatile...');
try {
  const result = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: 'Say hello in one word' }]
  });
  console.log('Success! Response:', result.choices[0]?.message?.content);
} catch (error) {
  console.error('Groq API call failed:', error);
}
