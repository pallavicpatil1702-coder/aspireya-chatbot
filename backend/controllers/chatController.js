import { firestoreDb } from '../config/firebase.js';
import { getGeminiModel } from '../config/gemini.js';

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

export const getChatHistory = async (req, res) => {
  const { uid } = req.user;
  try {
    const chatDoc = await firestoreDb.collection('chats').doc(uid).get();
    if (!chatDoc.exists) {
      // Return the default welcome message structured history
      const defaultHistory = {
        messages: [
          {
            sender: 'ai',
            text: `👋 Welcome to Aspireya Consulting!\n\nHello! I'm Aspireya AI, your Career Guidance Assistant.\n\nI can help you with:\n\n• Career Guidance\n• Stream Selection\n• Courses\n• Colleges\n• Entrance Exams\n• Skills\n• Higher Education\n• Career Opportunities\n\nHow can I help you today?`,
            timestamp: new Date().toISOString()
          }
        ]
      };
      await firestoreDb.collection('chats').doc(uid).set(defaultHistory);
      return res.json(defaultHistory);
    }
    res.json(chatDoc.data());
  } catch (error) {
    console.error('Error in getChatHistory:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

export const sendMessage = async (req, res) => {
  console.log("===== SEND MESSAGE API HIT =====");
  console.log("Request Body:", req.body);

  const { uid } = req.user;
  const { message } = req.body;

  // Get current user data
  const userRef = firestoreDb.collection('users').doc(uid);
  const userDoc = await userRef.get();

  const currentStage = userDoc.exists
    ? (userDoc.data().chatStage || 'none')
    : 'none';
  console.log("Current Stage:", currentStage);

  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Message content is required' });
  }

  try {
    // Detect if user completed 10th or 12th
    const lowerMessage = message.toLowerCase();

    console.log("Current Stage:", currentStage);
    console.log("Lower Message:", lowerMessage);

    // 10th flow
    if (currentStage === "none" && lowerMessage.includes("10th")) {
      await userRef.set(
        { chatStage: "waiting_for_subjects_10th" },
        { merge: true }
      );

      return res.json({
        reply:
          "🎉 Congratulations on completing your 10th! Please tell me your top 4 highest-scoring subjects along with their marks."
      });
    }

    // 12th flow
    if (currentStage === "none" && lowerMessage.includes("12th")) {
      await userRef.set(
        { chatStage: "waiting_for_stream" },
        { merge: true }
      );

      return res.json({
        reply:
          "🎉 Congratulations on completing your 12th!\nWhich stream did you study?\n• Science (PCM)\n• Science (PCB)\n• Commerce\n• Arts/Humanities\n• Other"
      });
    }
    // 1. Fetch existing chat history
    let chatDoc = await firestoreDb.collection('chats').doc(uid).get();
    let messages = [];
    if (chatDoc.exists) {
      messages = chatDoc.data().messages || [];
    } else {
      // Add default welcome message first if no history
      messages = [
        {
          sender: 'ai',
          text: `👋 Welcome to Aspireya Consulting!\n\nHello! I'm Aspireya AI, your Career Guidance Assistant.\n\nI can help you with:\n\n• Career Guidance\n• Stream Selection\n• Courses\n• Colleges\n• Entrance Exams\n• Skills\n• Higher Education\n• Career Opportunities\n\nHow can I help you today?`,
          timestamp: new Date().toISOString()
        }
      ];
    }

    // 2. Append new user message to history
    const userMessage = {
      sender: 'user',
      text: message,
      timestamp: new Date().toISOString()
    };
    messages.push(userMessage);

    // Count user messages
    const userMessageCount = messages.filter(
      msg => msg.sender === "user"
    ).length;


    const shouldSuggestAssessment =
      userMessageCount >= 5 ||
      lowerMessage.includes("confused") ||
      lowerMessage.includes("i'm confused") ||
      lowerMessage.includes("i am confused") ||
      lowerMessage.includes("can't decide") ||
      lowerMessage.includes("cannot decide") ||
      lowerMessage.includes("not sure") ||
      lowerMessage.includes("which career is best") ||
      lowerMessage.includes("personalized roadmap");

    // 3. Prepare Gemini API inputs (History mapping)
    const geminiHistory = [];
    // Convert previous dialogue (excluding welcome message to save tokens/keep system context clear if desired, or include it)
    messages.forEach((msg) => {
      // Map 'ai' to 'model', 'user' to 'user' for Gemini compatibility
      const role = msg.sender === 'user' ? 'user' : 'model';
      geminiHistory.push({
        role: role,
        parts: [{ text: msg.text }]
      });
    });

    // 4. Inject System Prompt and Profile Context
    const profileContext = await getUserProfileContext(uid);
    const systemPromptWithContext = SYSTEM_PROMPT + profileContext;

    // Remove the last message from geminiHistory to pass it as the active prompt with history
    const activeUserMessage = geminiHistory.pop();
    const promptToSend = activeUserMessage.parts[0].text;

    // Ensure geminiHistory starts with a 'user' message as required by Gemini API
    const firstUserIdx = geminiHistory.findIndex(msg => msg.role === 'user');
    const filteredHistory = firstUserIdx !== -1 ? geminiHistory.slice(firstUserIdx) : [];

    // 5. Invoke Gemini Model
    const model = getGeminiModel('gemini-2.5-flash');

    // We start the chat session
    const chat = model.startChat({
      history: filteredHistory,
      systemInstruction: { parts: [{ text: systemPromptWithContext }] }
    });

    console.log("Creating Gemini chat...");

    const result = await chat.sendMessage(promptToSend);

    console.log("Gemini Response Received");

    const aiResponseText = result.response.text();

    let finalReply = aiResponseText;

    if (shouldSuggestAssessment) {
      finalReply += `

🎯 Take Career Assessment

📅 Book Career Guidance Session

A Career Assessment helps identify your strengths, interests, personality, and suitable career options. It also provides a personalized career roadmap.`;
    }

    // 6. Append AI response
    const aiMessage = {
      sender: 'ai',
      text: finalReply,
      timestamp: new Date().toISOString()
    };
    messages.push(aiMessage);

    // 7. Save updated history to Firestore
    await firestoreDb.collection('chats').doc(uid).set({
      messages,
      lastUpdated: new Date().toISOString()
    });

    res.json({
      reply: finalReply,
      messages
    });

  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({ error: 'Failed to process message with AI', details: error.message });
  }
};


export const clearChatHistory = async (req, res) => {
  const { uid } = req.user;
  try {
    const defaultHistory = {
      messages: [
        {
          sender: 'ai',
          text: `👋 Welcome to Aspireya Consulting!\n\nHello! I'm Aspireya AI, your Career Guidance Assistant.\n\nI can help you with:\n\n• Career Guidance\n• Stream Selection\n• Courses\n• Colleges\n• Entrance Exams\n• Skills\n• Higher Education\n• Career Opportunities\n\nHow can I help you today?`,
          timestamp: new Date().toISOString()
        }
      ],
      lastUpdated: new Date().toISOString()
    };
    await firestoreDb.collection('chats').doc(uid).set(defaultHistory);
    res.json({ message: 'Chat history cleared successfully', ...defaultHistory });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({ error: 'Failed to clear chat history' });
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

