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
    } 
    else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      extractedText = result.value;
    }
    else if (file.mimetype === 'text/plain') {
      extractedText = file.buffer.toString('utf-8');
    }
    else if (file.mimetype.startsWith('image/')) {
      if (aiIsMock || !aiClient) {
        extractedText = '[Image processing unavailable in Mock Mode]';
      } else {
        const base64Image = file.buffer.toString('base64');
        const response = await aiClient.chat.completions.create({
          model: 'llama-3.2-90b-vision-preview',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Extract all the visible text, details, and describe the contents of this image comprehensively so it can be used for career counseling, resume analysis, or document verification. Do not converse, just extract and describe.' },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${file.mimetype};base64,${base64Image}`
                  }
                }
              ]
            }
          ]
        });
        extractedText = response.choices[0]?.message?.content || '[Image processing failed to extract content]';
      }
    }

    return truncateText(extractedText.trim());
  } catch (error) {
    console.error('File processing error:', error);
    throw new Error('Failed to process uploaded file.');
  }
};
