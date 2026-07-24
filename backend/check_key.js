import dotenv from 'dotenv';
dotenv.config();

console.log('--- ENV CHECK ---');
console.log('GROQ_API_KEY key is defined:', process.env.GROQ_API_KEY !== undefined);
if (process.env.GROQ_API_KEY) {
  console.log('Length of key:', process.env.GROQ_API_KEY.length);
  console.log('Trimmed key length:', process.env.GROQ_API_KEY.trim().length);
  console.log('First 5 characters:', JSON.stringify(process.env.GROQ_API_KEY.substring(0, 10)));
}
console.log('Keys in process.env:', Object.keys(process.env).filter(k => k.includes('GROQ')));
