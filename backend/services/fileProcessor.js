import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
import { aiClient, aiIsMock } from '../config/gemini.js';

const MAX_TOKENS = 3000;

function truncateText(text) {
  if (!text) return '';
  // Rough estimate: 1 word ~ 1.3 tokens. 
  // Let's truncate to roughly 20,000 characters to be safe for LLM context limits.
  const charLimit = 20000;
  if (text.length > charLimit) {
    return text.substring(0, charLimit) + '... [Content truncated due to size limits]';
  }
  return text;
}

export const processFile = async (file) => {
  if (!file) return null;

  try {
    let extractedText = '';

    if (file.mimetype === 'application/pdf') {
      const data = await pdfParse(file.buffer);
      extractedText = data.text;
      if (!extractedText || extractedText.trim().length < 5) {
        extractedText = '[System Note: The uploaded PDF appears to be a scanned document or an image-based PDF with no readable text layer. OCR/Vision processing is currently offline. Please kindly inform the user that you cannot read image-based PDFs and ask them to type out their result or provide a text-based document instead.]';
      }
    } 
    else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      extractedText = result.value;
    }
    else if (file.mimetype === 'text/plain') {
      extractedText = file.buffer.toString('utf-8');
    }
    else if (file.mimetype.startsWith('image/')) {
      // Groq has decommissioned their vision models. Image text extraction will fail.
      // We explicitly inform the LLM and the user via this extracted text.
      extractedText = '[System Note: Image processing is currently unsupported because the vision model is offline. Please ask the user to type out their result, or upload it as a PDF document instead.]';
    }

    return truncateText(extractedText.trim());
  } catch (error) {
    console.error('File processing error:', error);
    throw new Error('Failed to process uploaded file.');
  }
};
