import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

let groq = null;
let isMock = false;

if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here') {
  try {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
    console.log('Groq API client initialized.');
  } catch (error) {
    console.error('Failed to initialize Groq client:', error);
    isMock = true;
  }
} else {
  console.warn('⚠️ WARNING: GROQ_API_KEY is not set or is using placeholder. Using mock AI response mode.');
  isMock = true;
}

// Mock Gemini response generator for offline/local development
const generateMockResponse = async (prompt, history = []) => {
  console.log('[Mock AI] Generating response for prompt:', prompt.substring(0, 60) + '...');
  
  const promptLower = prompt.toLowerCase();
  
  // PRD Business Logic B: Career Roadmap (Career Assessment Test)
  // Triggers: "Which career is best?", "Which course should I choose?", "I'm confused."
  if (
    promptLower.includes('which career is best') || 
    promptLower.includes('which career') || 
    promptLower.includes('best career') || 
    promptLower.includes('which course should i choose') || 
    promptLower.includes('which course') || 
    promptLower.includes('confused') || 
    promptLower.includes('i\'m confused') || 
    promptLower.includes('im confused') || 
    promptLower.includes('i am confused') || 
    promptLower.includes('suggest a career')
  ) {
    return `Choosing a career path is a major milestone, and it's completely normal to feel confused! 
 
To help you find the right path, we highly recommend taking our **Career Assessment Test**. It is a structured assessment designed to analyze your interests, strengths, preferences, and work style, enabling us to create a personalized, step-by-step career roadmap for you.
 
Would you like to start the assessment now?
🎯 **Take Career Assessment**`;
  }
  
  // PRD Business Logic C: Personal Guidance (Book Career Session)
  // Triggers: "I need expert advice.", "Can someone guide me?", "I'm unable to decide."
  if (
    promptLower.includes('expert advice') || 
    promptLower.includes('i need expert advice') || 
    promptLower.includes('need expert advice') || 
    promptLower.includes('can someone guide me') || 
    promptLower.includes('someone guide me') || 
    promptLower.includes('guide me') || 
    promptLower.includes('unable to decide') || 
    promptLower.includes('i\'m unable to decide') || 
    promptLower.includes('im unable to decide') || 
    promptLower.includes('i am unable to decide') || 
    promptLower.includes('counselling') || 
    promptLower.includes('personal guidance') || 
    promptLower.includes('one-to-one')
  ) {
    return `If you are looking for personalized, deep-dive advice, speaking with our career experts can help clarify your options. 
 
You can book a one-to-one consultation session where we can discuss your goals, options, and challenges in detail to help you make the right choice.
📅 **Book Career Session**`;
  }
  
  if (promptLower.includes('what happens in the assessment') || promptLower.includes('assessment info')) {
    return `The **Career Assessment Test** consists of simple, intuitive questions designed to understand your interests, strengths, preferences, and work style. Once you complete it, you will receive a personalized, step-by-step career roadmap to help guide your decisions.`;
  }
  
  if (promptLower.includes('after 10th')) {
    return `After 10th grade, you have several primary streams to choose from: Science (Medical/Non-Medical), Commerce, and Arts/Humanities. You can also explore diploma programs or vocational courses. 
 
To explore what fits your interest best, we can look at your favorite subjects. Or, you can take our structured 🎯 **Career Assessment** for a precise recommendation!`;
  }
  
  if (promptLower.includes('after 12th')) {
    return `After 12th grade, your options expand significantly based on your stream. For Science students, options include B.Tech, MBBS, B.Sc, BCA, or specialized design and architecture courses. Commerce students can explore CA, CS, B.Com, BBA, or Economics. Arts students have options like Law (BA LLB), Liberal Arts, Journalism, and Fine Arts.
 
What subjects did you study in 12th grade? Let's narrow down your options together!`;
  }

  // Fallback career counseling conversational responses
  return `That's an interesting topic! Preparing for a career in that area requires building key skills. I'd recommend exploring online certification courses, working on personal projects, and looking for internship opportunities to gain practical experience.
 
Is there a specific skill or course in this field you'd like to know more about? Or would you like to take our 🎯 **Career Assessment** to map out your plan?`;
};

export const getGeminiModel = (modelName = 'llama-3.3-70b-versatile') => {
  if (isMock || !groq) {
    return {
      generateContent: async (contents) => {
        let promptText = '';
        if (typeof contents === 'string') {
          promptText = contents;
        } else if (contents.contents) {
          const parts = contents.contents;
          const lastPart = parts[parts.length - 1];
          promptText = lastPart.parts[0].text;
        }
        
        const mockText = await generateMockResponse(promptText);
        return {
          response: {
            text: () => mockText
          }
        };
      },
      startChat: (config) => {
        const history = config?.history || [];
        return {
          sendMessage: async (message) => {
            const mockText = await generateMockResponse(message, history);
            return {
              response: {
                text: () => mockText
              }
            };
          }
        };
      }
    };
  }
  
  return {
    generateContent: async (contents) => {
      let messages = [];
      if (typeof contents === 'string') {
        messages.push({ role: 'user', content: contents });
      } else if (contents.contents) {
        messages = contents.contents.map(msg => ({
          role: msg.role === 'model' ? 'assistant' : msg.role,
          content: msg.parts[0].text
        }));
      }

      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
      });

      const reply = completion.choices[0]?.message?.content || '';
      return {
        response: {
          text: () => reply
        }
      };
    },
    startChat: (config) => {
      const localHistory = [...(config?.history || [])];
      const systemPrompt = config?.systemInstruction?.parts?.[0]?.text;

      return {
        sendMessage: async (message) => {
          const messages = [];
          if (systemPrompt) {
            messages.push({ role: 'system', content: systemPrompt });
          }
          for (const msg of localHistory) {
            messages.push({
              role: msg.role === 'model' ? 'assistant' : msg.role,
              content: msg.parts[0].text
            });
          }
          messages.push({ role: 'user', content: message });

          const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: messages,
          });

          const reply = completion.choices[0]?.message?.content || '';

          // Maintain history in the same format
          localHistory.push({ role: 'user', parts: [{ text: message }] });
          localHistory.push({ role: 'model', parts: [{ text: reply }] });

          return {
            response: {
              text: () => reply
            }
          };
        }
      };
    }
  };
};

export const aiIsMock = isMock;
export const aiClient = groq;

