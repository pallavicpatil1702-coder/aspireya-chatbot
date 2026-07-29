import { firestoreDb, firebaseStorage } from '../config/firebase.js';
import { getGeminiModel } from '../config/gemini.js';
import crypto from 'crypto';
import { processFile } from '../services/fileProcessor.js';

import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let faqCache = null;
const loadFaqCache = () => {
  if (faqCache) return faqCache;
  try {
    const faqPath = path.join(__dirname, '../data/faq.json');
    const data = fs.readFileSync(faqPath, 'utf8');
    faqCache = JSON.parse(data);
  } catch (error) {
    console.error("Failed to load FAQ cache:", error);
    faqCache = [];
  }
  return faqCache;
};

const FREE_MESSAGE_LIMIT = 30;
const FREE_FILE_UPLOAD_LIMIT = 5;

const SYSTEM_PROMPT = `
You are "Aspireya AI", the official AI Career Guidance Assistant for Aspireya Consulting.
Your role is to act as a friendly, supportive, positive, patient, and highly professional career counsellor. Do not sound promotional. Maintain a professional tone suitable for students. Keep replies relatively short and conversational. Avoid walls of text.

Supported Topics:
- Career options, courses, college/exam preparation, skills, higher education, certifications, technology careers, resume tips, interview prep, career trends, learning resources, and internship guidance.
If the user asks something completely unrelated to career guidance, education, or professional development, politely redirect them back to career topics.

CRITICAL RULES:

1. GENERAL CAREER AND EDUCATION INQUIRIES:
   - For normal, informational, or career-related questions, you MUST answer them directly and provide guidance.
   - Examples of direct questions include: "Which stream should I choose after 10th?", "Which subjects should I take in 11th?", "Which course is better after 12th?", "What is BCA?", "Difference between B.Tech and B.Sc?", "Best colleges?", "Entrance exams?", "Government jobs?", "AI career?", "Software Engineering?", "Medical career?", "Commerce career?", etc.
   - For these normal questions, do NOT recommend the Career Assessment Test. Provide clear guidance first and, if necessary, ask clarifying follow-up questions before making final recommendations.

2. CAREER ASSESSMENT (ROADMAP) RULE:
   - Recommend the "Career Assessment Test" ONLY when the user:
     a) is confused about their career
     b) asks "Which career is best for me?"
     c) asks for a personalized recommendation
     d) wants guidance based on interests or personality
     e) cannot decide between multiple options
     f) asks for a complete career roadmap
   - In these specific cases, explain that a personalized career roadmap requires our "Career Assessment Test" to analyze their Interests, Strengths, Preferences, and Work Style.
   - When recommending the test under these conditions, include these two exact CTA recommendations in your response: "🎯 Take Career Assessment" and "📅 Book Career Guidance Session".
   - Otherwise, do NOT display or mention these recommendations or buttons.

3. MEMORY & CONVERSATIONAL CONTEXT:
   - Always remember the user's name, education level, stream, interests, and goals if they share them during the chat.
   - Use short, natural responses.
   - Ask engaging follow-up questions one at a time. Do not overwhelm them with long paragraphs.
   - Use emojis sparingly and naturally (e.g. 👋, 🎯, 📅, 🎓, 💼, 📚, ❓).

   4. RESPONSE STYLE:
   - Keep responses short, clear, and conversational.
   - Default response length should be 50–120 words.
   - Answer in 1-2 short sentences unless the user asks for detailed information.
   - Avoid long paragraphs and unnecessary explanations.
   - Use bullet points only when they improve readability.
   - Ask only ONE follow-up question at the end when appropriate.
   - If the user asks a simple question, give a simple answer.
   - Only provide detailed explanations if the user explicitly requests them.

5A. CONGRATULATIONS RULE

Only congratulate the user when they explicitly mention a genuine achievement or milestone.

Examples:
- I passed 10th.
- I completed 12th.
- I scored 92%.
- I completed graduation.
- I cleared JEE/NEET/CAT.
- I received a certificate.
- I got selected for a job or internship.

Do NOT congratulate the user for:
- Greetings (Hi, Hello, Hey)
- Asking questions
- Seeking career advice
- Normal conversation
- Mentioning interests
- Asking about courses, colleges, careers, exams, or skills

If the user's message does not describe an actual achievement, respond naturally without using phrases such as "Congratulations", "Good achievement", "Well done", or similar.


5. CAREER COUNSELLING CONVERSATION FLOW

When a student mentions that they have completed 10th or 12th, do not immediately recommend careers.

Follow this conversation flow naturally:

For students who have completed 10th:

Step 1:
- Congratulate the student.
- Ask:
"Congratulations on completing your 10th! 🎉
Could you please tell me your top 4 highest scoring subjects along with their marks?"

Step 2:
- After the student shares the subjects and marks, briefly acknowledge them.
- Then ask ONLY one follow-up question:
"What are your interests? For example: Technology, Business, Design, Medical, Government Jobs, Arts, Sports, Teaching, etc."

Step 3:
- After receiving the student's interests, combine:
  • Education level
  • Highest scoring subjects
  • Interests
to provide 3–5 suitable career options with a very short explanation for each.

- Explain very shortly why each career matches the student's strengths and interests.
- Keep the explanation short and easy to understand.

------------------------------------------------------------

For students who have completed 12th:

Step 1:
- Congratulate the student.
- FIRST ask:
"Congratulations on completing your 12th! 🎉
Which stream did you complete?
• Science (PCM/PCB/PCMB)
• Commerce
• Arts/Humanities
• Vocational
• Other"

Step 2:
- After the student tells their stream, ask:
"Could you please tell me your top 4 highest scoring subjects along with their marks?"

Step 3:
- After the student shares the subjects and marks, briefly acknowledge them.
- Then ask ONLY one follow-up question:
"What are your interests? For example: Technology, Business, Design, Medical, Government Jobs, Arts, Sports, Teaching, etc."

Step 4:
- After receiving the student's interests, combine:
  • Education level
  • Stream
  • Highest scoring subjects
  • Interests
to provide 3–5 suitable career options with a very short explanation for each.

- Explain very shortly why each career matches the student's strengths and interests.
- Keep the explanation short and easy to understand.

------------------------------------------------------------

If the student says:
• "I'm confused"
• "I need more clarity"
• "I'm not sure"
• "I don't know my strengths"
• "Which career is best for me?"
• "I can't decide"
• "I want a personalized roadmap"

THEN recommend the Career Assessment Test.

Explain that the assessment helps identify:
- Strengths
- Weaknesses
- Interests
- Personality
- Career Fit

Then include these exact CTAs:

🎯 Take Career Assessment

📅 Book Career Guidance Session

Mention that the guidance session helps explain the assessment report and provides a personalized career roadmap.

Do NOT recommend the Career Assessment Test before completing the above conversation unless the student directly asks for personalized career guidance.

6. RESPONSE QUALITY

- Never give unnecessary information.
- Never write long essays.
- Answer only what is relevant to the user's question.
- Keep replies between 50–60words unless detailed information is requested.
- Ask only ONE follow-up question at a time.
- Sound like an experienced career counsellor, not a search engine.
`;

// Fetch user's profile to inject context into the Gemini session
const getUserProfileContext = async (uid) => {
  try {
    const userDoc = await firestoreDb.collection('users').doc(uid).get();
    if (userDoc.exists) {
      const data = userDoc.data();
      const p = data.profile || {};
      return `\n\n[USER PROFILE CONTEXT] The user's name is "${data.displayName || 'good achievement'}". ` +
        `Education: "${p.education || 'Not specified'}". ` +
        `Stream: "${p.stream || 'Not specified'}". ` +
        `Interests: "${p.interests ? p.interests.join(', ') : 'Not specified'}". ` +
        `Skills: "${p.skills ? p.skills.join(', ') : 'Not specified'}". ` +
        `Goals: "${p.goals || 'Not specified'}".`;
    }
  } catch (error) {
    console.error('Error fetching user profile for chat context:', error.message);
  }
  return '';
};

// Check if user has reports (completed assessment)
const checkUserHasReports = async (uid) => {
  try {
    const userDoc = await firestoreDb.collection('users').doc(uid).get();
    if (userDoc.exists && userDoc.data().email) {
      const normalizedEmail = userDoc.data().email.trim().toLowerCase();
      const reportsSnapshot = await firestoreDb.collection('reports').where('email', '==', normalizedEmail).limit(1).get();
      if (reportsSnapshot && !reportsSnapshot.empty) {
        return true;
      }
    }
  } catch (error) {
    console.error('Error checking user reports:', error.message);
  }
  return false;
};

// Migrate legacy chat to a conversation
const migrateLegacyChat = async (uid) => {
  try {
    const legacyChatDoc = await firestoreDb.collection('chats').doc(uid).get();
    if (legacyChatDoc.exists) {
      const legacyData = legacyChatDoc.data();
      const convId = 'legacy_' + uid;
      
      const checkDoc = await firestoreDb.collection('conversations').doc(convId).get();
      if (!checkDoc.exists) {
        const userMessageCount = (legacyData.messages || []).filter(msg => msg.sender === 'user').length;
        
        await firestoreDb.collection('conversations').doc(convId).set({
          uid,
          title: 'Legacy Chat',
          createdAt: legacyData.lastUpdated || new Date().toISOString(),
          updatedAt: legacyData.lastUpdated || new Date().toISOString(),
          messageCount: userMessageCount,
          assessmentRecommended: legacyData.assessmentRecommended || false,
          lastMessage: 'View your previous conversation'
        });
        
        await firestoreDb.collection('messages').doc(convId).set({
          messages: legacyData.messages || []
        });
      }
    }
  } catch (error) {
    console.error('Error migrating legacy chat:', error);
  }
};

export const getConversations = async (req, res) => {
  const { uid } = req.user;
  try {
    // Attempt to migrate legacy chat if it exists
    await migrateLegacyChat(uid);

    const snapshot = await firestoreDb.collection('conversations')
      .where('uid', '==', uid)
      .get();
    
    let conversations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Sort in memory to avoid requiring a composite index in Firestore
    conversations.sort((a, b) => {
      const dateA = new Date(a.updatedAt || 0).getTime();
      const dateB = new Date(b.updatedAt || 0).getTime();
      return dateB - dateA; // descending
    });
    
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

export const getChatHistory = async (req, res) => {
  const { uid } = req.user;
  const conversationId = req.params.conversationId;
  
  try {
    const hasReports = await checkUserHasReports(uid);

    if (!conversationId) {
      // Fallback if no conversation ID provided (frontend compatibility)
      return res.json({ messages: [], limitRemaining: hasReports ? -1 : FREE_MESSAGE_LIMIT, limitReached: false });
    }

    const convRef = firestoreDb.collection('conversations').doc(conversationId);
    const convDoc = await convRef.get();
    
    if (!convDoc.exists || convDoc.data().uid !== uid) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const messagesDoc = await firestoreDb.collection('messages').doc(conversationId).get();
    let messages = [];
    if (messagesDoc.exists) {
      messages = messagesDoc.data().messages || [];
    }
    
    const data = convDoc.data();
    const userMessageCount = data.messageCount || 0;
    const limitRemaining = hasReports ? -1 : Math.max(0, FREE_MESSAGE_LIMIT - userMessageCount);
    const limitReached = !hasReports && userMessageCount >= FREE_MESSAGE_LIMIT;

    const userDoc = await firestoreDb.collection('users').doc(uid).get();
    const fileUploadCount = userDoc.exists ? (userDoc.data().fileUploadCount || 0) : 0;
    const uploadRemaining = hasReports ? -1 : Math.max(0, FREE_FILE_UPLOAD_LIMIT - fileUploadCount);
    const uploadLimitReached = !hasReports && fileUploadCount >= FREE_FILE_UPLOAD_LIMIT;

    res.json({ 
      ...data, 
      messages, 
      limitRemaining, 
      limitReached,
      uploadRemaining,
      uploadLimitReached 
    });
  } catch (error) {
    console.error('Error in getChatHistory:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

export const sendMessage = async (req, res) => {
  const { uid } = req.user;
  let { message, conversationId } = req.body;
  const file = req.file;

  if ((!message || message.trim() === '') && !file) {
    return res.status(400).json({ error: 'Message content or file is required' });
  }

  try {
    const userRef = firestoreDb.collection('users').doc(uid);
    const userDoc = await userRef.get();
    const currentStage = userDoc.exists ? (userDoc.data().chatStage || 'none') : 'none';
    const lowerMessage = message ? message.toLowerCase() : '';

    // Ensure conversation exists
    let isNewConversation = false;
    if (!conversationId) {
      conversationId = crypto.randomUUID();
      isNewConversation = true;
      await firestoreDb.collection('conversations').doc(conversationId).set({
        uid,
        title: 'New Conversation',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messageCount: 0,
        assessmentRecommended: false
      });
    }

    const convRef = firestoreDb.collection('conversations').doc(conversationId);
    const convDoc = await convRef.get();
    
    if (!convDoc.exists || convDoc.data().uid !== uid) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    let chatData = convDoc.data();

    // Load messages
    const messagesRef = firestoreDb.collection('messages').doc(conversationId);
    let messagesDoc = await messagesRef.get();
    let messages = [];
    
    if (messagesDoc.exists) {
      messages = messagesDoc.data().messages || [];
    } else {
      messages = [{
        sender: 'ai',
        text: `👋 Hello! I'm Aspireya AI, your Career Guidance Assistant. How can I help you today?`,
        timestamp: new Date().toISOString()
      }];
    }
    
    // Process file if present
    let attachmentMeta = null;
    let extractedText = '';
    const fileUploadCount = userDoc.exists ? (userDoc.data().fileUploadCount || 0) : 0;
    const hasReports = await checkUserHasReports(uid);

    if (file) {
      if (!hasReports && fileUploadCount >= FREE_FILE_UPLOAD_LIMIT) {
        return res.json({
          uploadLimitReached: true,
          uploadRemaining: 0,
          messages, // return existing messages
          conversationId
        });
      }

      try {
        // Upload to Storage
        if (firebaseStorage) {
          const bucket = firebaseStorage.bucket();
          const filename = `attachments/${uid}/${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          const fileUpload = bucket.file(filename);
          await fileUpload.save(file.buffer, { contentType: file.mimetype });
          try {
            await fileUpload.makePublic();
          } catch (e) {
            console.warn("Could not make file public, maybe IAM restricted", e.message);
          }
          const url = `https://storage.googleapis.com/${bucket.name}/${filename}`;
          attachmentMeta = {
            name: file.originalname,
            type: file.mimetype,
            size: file.size,
            url
          };
        } else {
          attachmentMeta = {
            name: file.originalname,
            type: file.mimetype,
            size: file.size,
            url: null
          };
        }

        // Extract Text for AI
        extractedText = await processFile(file);
      } catch (e) {
        console.error("File processing failed:", e);
        // Continue without extraction if failed, but keep attachmentMeta
      }
    }

    // Append user message
    messages.push({
      sender: 'user',
      text: message || '',
      extractedText: extractedText || null,
      attachment: attachmentMeta,
      timestamp: new Date().toISOString()
    });

    const userMessageCount = (chatData.messageCount || 0) + (message && message.trim() !== '' ? 1 : 0);
    // Note: If they ONLY uploaded a file, we can either count it as a message or just an upload.
    // The requirement says "Track uploads per USER", we'll track the upload separately.
    // Let's ensure the message limit logic still works.
    
    // We already fetched hasReports above
    
    const limitRemaining = hasReports ? -1 : Math.max(0, FREE_MESSAGE_LIMIT - userMessageCount);
    const limitReached = !hasReports && userMessageCount > FREE_MESSAGE_LIMIT;

    if (limitReached) {
      messages.pop(); // Remove blocked message
      return res.json({
        limitReached: true,
        limitRemaining: 0,
        messages,
        conversationId
      });
    }

    // Check for hardcoded 10th / 12th flow or FAQ Match
    let bypassReply = null;
    
    const faqList = loadFaqCache();
    const cleanMessage = lowerMessage.replace(/[^\w\s]/g, '').trim();
    const wordCount = cleanMessage.split(/\s+/).length;
    
    // Only apply static FAQ bypass if the message is short (<= 10 words).
    // This prevents complex career questions that happen to contain a keyword 
    // from getting a generic, incorrect response.
    if (wordCount <= 10) {
      for (const faq of faqList) {
        const hasMatch = faq.keywords.some(kw => {
          const regex = new RegExp(`\\b${kw}\\b`, 'i');
          return regex.test(cleanMessage);
        });
        if (hasMatch) {
          bypassReply = faq.response;
          break;
        }
      }
    }

    if (!bypassReply) {
      if (currentStage === "none" && lowerMessage.includes("10th")) {
        await userRef.set({ chatStage: "waiting_for_subjects_10th" }, { merge: true });
        bypassReply = "🎉 Congratulations on completing your 10th! Please tell me your top 4 highest-scoring subjects along with their marks.";
      } else if (currentStage === "none" && lowerMessage.includes("12th")) {
        await userRef.set({ chatStage: "waiting_for_stream" }, { merge: true });
        bypassReply = "🎉 Congratulations on completing your 12th!\nWhich stream did you study?\n• Science (PCM)\n• Science (PCB)\n• Commerce\n• Arts/Humanities\n• Other";
      }
    }

    // Title generation on first message
    let generatedTitle = chatData.title;
    if (userMessageCount === 1 && message) {
      generatedTitle = message.substring(0, 30);
      if (message.length > 30) generatedTitle += '...';
    }

    if (bypassReply) {
      messages.push({
        sender: 'ai',
        text: bypassReply,
        timestamp: new Date().toISOString()
      });
      await messagesRef.set({ messages });
      await convRef.update({
      title: generatedTitle,
      updatedAt: new Date().toISOString(),
      messageCount: userMessageCount,
      lastMessage: bypassReply.substring(0, 50) + '...'
    });

    let newFileUploadCount = fileUploadCount;
    if (file) {
      newFileUploadCount += 1;
      await userRef.set({ fileUploadCount: newFileUploadCount }, { merge: true });
    }

      const uploadRemaining = hasReports ? -1 : Math.max(0, FREE_FILE_UPLOAD_LIMIT - newFileUploadCount);

      return res.json({
        reply: bypassReply,
        messages,
        limitReached: !hasReports && userMessageCount >= FREE_MESSAGE_LIMIT,
        limitRemaining,
        uploadLimitReached: !hasReports && newFileUploadCount >= FREE_FILE_UPLOAD_LIMIT,
        uploadRemaining,
        conversationId,
        title: generatedTitle
      });
    }

    const isExplicitRequest =
      lowerMessage.includes("confused") ||
      lowerMessage.includes("i'm confused") ||
      lowerMessage.includes("i am confused") ||
      lowerMessage.includes("can't decide") ||
      lowerMessage.includes("cannot decide") ||
      lowerMessage.includes("not sure") ||
      lowerMessage.includes("which career is best") ||
      lowerMessage.includes("personalized roadmap") ||
      lowerMessage.includes("career assessment") ||
      lowerMessage.includes("assessment test");

    const alreadyRecommended = chatData.assessmentRecommended === true;
    const shouldSuggestAssessment = isExplicitRequest || (!alreadyRecommended && userMessageCount >= 5);

    // AI logic
    const geminiHistory = [];
    messages.forEach((msg) => {
      const role = msg.sender === 'user' ? 'user' : 'model';
      let fullText = msg.text || '';
      if (msg.extractedText) {
        fullText += `\n\n[Attached File Content: ${msg.attachment?.name || 'File'}]\n${msg.extractedText}`;
      }
      if (!fullText.trim()) fullText = '[User sent a file]';
      geminiHistory.push({
        role: role,
        parts: [{ text: fullText }]
      });
    });

    const profileContext = await getUserProfileContext(uid);
    const systemPromptWithContext = SYSTEM_PROMPT + profileContext;

    // Prepare AI Prompt
    let finalAiPrompt = message || '';
    if (extractedText) {
      finalAiPrompt += `\n\n[Attached File Content: ${file.originalname}]\n${extractedText}`;
    }

    const activeUserMessage = geminiHistory.pop();
    const promptToSend = finalAiPrompt;

    const firstUserIdx = geminiHistory.findIndex(msg => msg.role === 'user');
    const filteredHistory = firstUserIdx !== -1 ? geminiHistory.slice(firstUserIdx) : [];

    const model = getGeminiModel('gemini-2.5-flash');
    const chat = model.startChat({
      history: filteredHistory,
      systemInstruction: { parts: [{ text: systemPromptWithContext }] }
    });

    const result = await chat.sendMessage(promptToSend);
    let finalReply = result.response.text();

    if (shouldSuggestAssessment) {
      finalReply += `\n\n🎯 Take Career Assessment\n\n📅 Book Career Guidance Session\n\nA Career Assessment helps identify your strengths, interests, personality, and suitable career options. It also provides a personalized career roadmap.`;
    }

    messages.push({
      sender: 'ai',
      text: finalReply,
      timestamp: new Date().toISOString()
    });

    await messagesRef.set({ messages });
    
    await convRef.update({
      title: generatedTitle,
      updatedAt: new Date().toISOString(),
      messageCount: userMessageCount,
      assessmentRecommended: shouldSuggestAssessment || chatData.assessmentRecommended || false,
      lastMessage: finalReply.substring(0, 50) + '...'
    });

    let newFileUploadCount = fileUploadCount;
    if (file && !bypassReply) {
      newFileUploadCount += 1;
      await userRef.set({ fileUploadCount: newFileUploadCount }, { merge: true });
    }
    
    const uploadRemaining = hasReports ? -1 : Math.max(0, FREE_FILE_UPLOAD_LIMIT - newFileUploadCount);

    res.json({
      reply: finalReply,
      messages,
      limitReached: !hasReports && userMessageCount >= FREE_MESSAGE_LIMIT,
      limitRemaining,
      uploadLimitReached: !hasReports && newFileUploadCount >= FREE_FILE_UPLOAD_LIMIT,
      uploadRemaining,
      conversationId,
      title: generatedTitle
    });

  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({ error: 'Failed to process message with AI', details: error.message });
  }
};

export const clearChatHistory = async (req, res) => {
  const { uid } = req.user;
  const { conversationId } = req.params;
  try {
    const convRef = firestoreDb.collection('conversations').doc(conversationId);
    const convDoc = await convRef.get();
    if (!convDoc.exists || convDoc.data().uid !== uid) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const defaultHistory = {
      messages: [{
        sender: 'ai',
        text: `👋 Hello! I'm Aspireya AI, your Career Guidance Assistant. How can I help you today?`,
        timestamp: new Date().toISOString()
      }]
    };
    
    await firestoreDb.collection('messages').doc(conversationId).set(defaultHistory);
    
    await convRef.update({
      messageCount: 0,
      assessmentRecommended: false,
      updatedAt: new Date().toISOString(),
      lastMessage: 'Chat cleared'
    });
    
    const hasReports = await checkUserHasReports(uid);
    const userRef = firestoreDb.collection('users').doc(uid);
    const userDoc = await userRef.get();
    const fileUploadCount = userDoc.exists ? (userDoc.data().fileUploadCount || 0) : 0;
    
    res.json({ 
      message: 'Chat history cleared successfully', 
      ...defaultHistory, 
      limitReached: false, 
      limitRemaining: hasReports ? -1 : FREE_MESSAGE_LIMIT,
      uploadLimitReached: !hasReports && fileUploadCount >= FREE_FILE_UPLOAD_LIMIT,
      uploadRemaining: hasReports ? -1 : Math.max(0, FREE_FILE_UPLOAD_LIMIT - fileUploadCount)
    });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
};

export const renameConversation = async (req, res) => {
  const { uid } = req.user;
  const { conversationId } = req.params;
  const { title } = req.body;
  try {
    const docRef = firestoreDb.collection('conversations').doc(conversationId);
    const doc = await docRef.get();
    if (!doc.exists || doc.data().uid !== uid) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    await docRef.update({ title, updatedAt: new Date().toISOString() });
    res.json({ message: 'Conversation renamed successfully' });
  } catch (error) {
    console.error('Error renaming conversation:', error);
    res.status(500).json({ error: 'Failed to rename conversation' });
  }
};

export const deleteConversation = async (req, res) => {
  const { uid } = req.user;
  const { conversationId } = req.params;
  try {
    const docRef = firestoreDb.collection('conversations').doc(conversationId);
    const doc = await docRef.get();
    if (!doc.exists || doc.data().uid !== uid) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    await docRef.delete();
    await firestoreDb.collection('messages').doc(conversationId).delete();
    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
};

export const saveUserProfile = async (req, res) => {
  const { uid } = req.user;
  const profileData = req.body;

  if (!profileData.fullName || !profileData.email || !profileData.mobile) {
    return res.status(400).json({ error: 'Full Name, Email, and Mobile Number are required.' });
  }

  try {
    const userRef = firestoreDb.collection('users').doc(uid);
    await userRef.set({
      displayName: profileData.fullName,
      email: profileData.email,
      mobile: profileData.mobile,
      profile: {
        education: profileData.currentEducation,
        classOrQualification: profileData.classOrQualification,
        institution: profileData.schoolOrCollege,
        state: profileData.state,
        city: profileData.city,
      },
      onboarded: true,
      lastUpdated: new Date().toISOString()
    }, { merge: true });

    let hasReports = false;
    const normalizedEmail = profileData.email.trim().toLowerCase();
    const reportsSnapshot = await firestoreDb.collection('reports').where('email', '==', normalizedEmail).limit(1).get();
    
    if (reportsSnapshot && !reportsSnapshot.empty) {
      hasReports = true;
    }

    res.json({ message: 'Profile saved successfully', hasReports });
  } catch (error) {
    console.error('Error in saveUserProfile:', error);
    res.status(500).json({ error: 'Failed to save user profile', details: error.message });
  }
};
