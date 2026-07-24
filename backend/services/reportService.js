import { aiClient, aiIsMock } from '../config/gemini.js';

export const getDetailedEducationLevel = (profile) => {
  const edu = (profile.profile?.education || "").toLowerCase();
  const qual = (profile.profile?.classOrQualification || "").toLowerCase();
  const text = `${edu} ${qual}`.toLowerCase();

  // Class 5-8
  const class5to8Patterns = [
    /\bclass\s*[5-8]\b/i,
    /\bgrade\s*[5-8]\b/i,
    /\b(5|6|7|8)th\b/i,
    /\b(v|vi|vii|viii)\b/i,
    /^\s*[5-8]\s*$/i,
  ];

  // Class 9-10
  const class9to10Patterns = [
    /\bclass\s*(9|10)\b/i,
    /\bgrade\s*(9|10)\b/i,
    /\b(9|10)th\b/i,
    /\b(ix|x)\b/i,
    /^\s*(9|10)\s*$/i,
    /high school/i
  ];

  // Class 11-12
  const class11to12Patterns = [
    /\bclass\s*(11|12)\b/i,
    /\bgrade\s*(11|12)\b/i,
    /\b(11|12)th\b/i,
    /\b(xi|xii)\b/i,
    /^\s*(11|12)\s*$/i,
    /higher secondary/i
  ];

  // Diploma / Undergraduate
  const undergradPatterns = [
    /undergraduate/i,
    /college/i,
    /b\.tech/i,
    /btech/i,
    /bca/i,
    /bsc/i,
    /bcom/i,
    /bba/i,
    /ba\b/i,
    /undergrad/i,
    /diploma/i
  ];

  // Postgraduate / Working Professional
  const professionalPatterns = [
    /postgraduate/i,
    /postgrad/i,
    /phd/i,
    /ph\.d/i,
    /working/i,
    /professional/i,
    /m\.tech/i,
    /mtech/i,
    /mba/i,
    /mca/i,
    /msc/i,
    /mcom/i,
    /executive/i,
    /corporate/i
  ];

  const matchText = (str, patterns) => patterns.some(pattern => pattern.test(str));

  if (matchText(text, class5to8Patterns)) {
    return "class_5_8";
  }
  if (matchText(text, class9to10Patterns)) {
    return "class_9_10";
  }
  if (matchText(text, class11to12Patterns)) {
    return "class_11_12";
  }
  if (matchText(text, undergradPatterns)) {
    return "undergraduate";
  }
  if (matchText(text, professionalPatterns)) {
    return "professional";
  }

  // Fallback checks
  if (edu.includes("10") || edu.includes("high school")) return "class_9_10";
  if (edu.includes("12") || edu.includes("secondary")) return "class_11_12";
  if (edu.includes("undergraduate") || edu.includes("diploma")) return "undergraduate";
  if (edu.includes("postgraduate") || edu.includes("phd") || edu.includes("working")) return "professional";

  return "class_9_10"; // Default fallback
};

export const generateAIReport = async (
  profile,
  matchResults,
  answersWithMetadata = [],
  assessmentType
) => {
  const educationLevel =
    assessmentType || getDetailedEducationLevel(profile);
  const top3 = Array.isArray(matchResults?.recommendations)
    ? matchResults.recommendations.slice(0, 3)
    : [];

  if (aiIsMock) {
    console.log('[Mock Mode] Generating high-quality counsellor report for:', profile.displayName, 'Level:', educationLevel);
    return generateMockReport(profile, top3, matchResults.userTraits, educationLevel);
  }

  // Format full metadata responses for the AI
  const formattedAnswers = answersWithMetadata.map(ans => {
    return `- Question #${ans.questionId}: "${ans.questionText}" | Category: "${ans.category}" | Trait: "${ans.trait}" | Weight: ${JSON.stringify(ans.weight)} | ReverseScoring: ${ans.reverseScoring} | Response: "${ans.selectedAnswer}"`;
  }).join('\n');

  // Load level-specific schema and prompts
  let targetSchema = '';
  let allowedSections = '';
  let forbiddenSections = '';
  let templateRules = '';

  if (educationLevel === 'class_5_8') {
    allowedSections = 'My Interests, My Strengths, My Learning Style, My Favourite Subjects, Activities To Explore, Skills I Can Improve, Study Tips, Fun Learning Challenges, Parent Guidance, Teacher Guidance, 30-Day Learning Plan';
    forbiddenSections = 'Executive Talent Dashboard, Executive Focus Areas, Career Recommendation, Salary, AI Automation Risk, Industry Readiness, Skill Gap Analysis, Competency Analysis, Vocational Interest, Career Intelligence, Programming Experience, Data Analysis Skills, Executive/Corporate Terminology, Internship, Job Roles, Certifications, Leadership Index, Market Demand';
    targetSchema = `{
  "reportTitle": "My Learning & Growth Report",
  "executiveSummary": "A warm, encouraging paragraph (50-80 words) in simple English summarizing the student's unique learning profile.",
  "myInterests": "A short simple summary of what subjects and areas catch the student's curiosity.",
  "myStrengths": [
    { "strength": "Strength Name", "why": "Why this is a strength based on their answers." }
  ],
  "myLearningStyle": "Simple explanation of how the child learns best based on their responses.",
  "myFavouriteSubjects": ["Subject 1", "Subject 2"],
  "activitiesToExplore": ["Simple activity or school hobby 1", "Simple activity or school hobby 2"],
  "skillsICanImprove": [
    { "skill": "Skill name", "how": "Actionable simple guidance to build it." }
  ],
  "studyTips": ["Tip 1", "Tip 2"],
  "funLearningChallenges": ["Fun quiz, exploration challenge, or game activity 1", "Fun quiz, exploration challenge, or game activity 2"],
  "parentGuidance": "Encouraging advice for parents to support the student's learning.",
  "teacherGuidance": "Actionable advice for teachers and mentors.",
  "learningPlan30Day": ["Week 1 Milestone", "Week 2 Milestone", "Week 3 Milestone", "Week 4 Milestone"]
}`;
    templateRules = `Focus entirely on helping the student learn, explore interests, and build confidence. Use very simple vocabulary suitable for children and parents.`;
  } else if (educationLevel === 'class_9_10') {
    allowedSections = 'Subject Interests, Stream Suggestions, Strengths, Learning Style, Study Strategy, Skills To Build, Activities To Explore, Parent Guidance, Teacher Guidance, Future Exploration';
    forbiddenSections = 'Salary, Job Roles, Industry Readiness, Corporate Skills, Executive Dashboard, AI Risk, Skill Gap Analysis';
    targetSchema = `{
  "reportTitle": "Stream Exploration Report",
  "executiveSummary": "Encouraging simple summary paragraph (60-80 words) in simple English explaining subject inclinations and stream planning.",
  "subjectInterests": "Simple summary of school subjects they like and why.",
  "streamSuggestions": [
    {
      "stream": "Science, Commerce, or Arts",
      "suitability": "High / Medium / Low",
      "whyItFits": "Detailed simple explanation based on responses."
    }
  ],
  "strengths": [
    { "name": "Strength Name", "description": "Simple description of how this helps them in high school." }
  ],
  "learningStyle": "Simple explanation of how they study and absorb information best.",
  "studyStrategy": ["Study habit tip 1", "Study habit tip 2"],
  "skillsToBuild": [
    { "skill": "Skill Name", "howToBuild": "Actionable simple way to grow this skill." }
  ],
  "activitiesToExplore": ["Exhibitions, clubs, or Olympiad areas to join 1", "Exhibitions, clubs, or Olympiad areas to join 2"],
  "parentGuidance": "Simple advice for parents to guide subject choices and support stream selection.",
  "teacherGuidance": "Guidance for high school teachers to support the student.",
  "futureExploration": "Plain explanation of ways they can explore subjects (e.g. read basic magazines, science tasks)."
}`;
    templateRules = `Focus on subject interests, stream selection (Science, Commerce, Arts) and high school skill-building. Wording must be simple and easy to understand.`;
  } else if (educationLevel === 'class_11_12') {
    allowedSections = 'Career Fields, Degrees, Entrance Exams, Roadmap, Skill Development, Higher Education';
    forbiddenSections = 'Executive Dashboard, Executive Terminology, Leadership Index, Corporate Pivots';
    targetSchema = `{
  "reportTitle": "Career Planning Report",
  "executiveSummary": "Clear, encouraging summary (80-100 words) summarizing their interests, potential fields, and college preparation status.",
  "careerFields": [
    {
      "field": "Career Field Name (e.g., Software Engineering & Technology)",
      "whyMatches": "Detailed plain explanation of how this field matches their responses."
    }
  ],
  "degrees": ["Target Degree 1 (e.g. B.Tech, BCA)", "Target Degree 2"],
  "entranceExams": ["Exam 1 (e.g. JEE Main)", "Exam 2 (e.g. CUET-UG)"],
  "roadmap": ["Academic roadmap step 1", "Academic roadmap step 2"],
  "skillDevelopment": [
    { "skill": "Skill Name", "actionPlan": "Action plan to build it during high school." }
  ],
  "higherEducation": "Plain explanation of college preparation and choice guidelines."
}`;
    templateRules = `Focus on recommended career fields, degrees, college entrance exams, and academic roadmaps. Wording must remain clear and easy to understand.`;
  } else if (educationLevel === 'undergraduate') {
    allowedSections = 'Career Paths, Internships, Certifications, Skill Gap Analysis, Industry Readiness, Career Roadmap';
    targetSchema = `{
  "reportTitle": "Career Intelligence Report",
  "executiveSummary": "Professional and encouraging summary (90-120 words) detailing entry-level readiness, match index, and immediate pathways.",
  "careerPaths": [
    {
      "career": "Career Name (e.g., Software Developer)",
      "matchPercentage": 92,
      "whyMatches": "Plain explanation of why this fits their profile based on their answers.",
      "shortTermMilestones": ["Immediate action item 1", "Immediate action item 2"],
      "longTermMilestones": ["Long term goal 1", "Long term goal 2"]
    }
  ],
  "internships": ["Internship role/project 1", "Internship role/project 2"],
  "certifications": ["Target Certification 1", "Target Certification 2"],
  "skillGapAnalysis": {
    "requiredSkills": ["Required Skill 1", "Required Skill 2"],
    "userGaps": ["Area 1 where user needs training", "Area 2 where user needs training"],
    "actionPlan": "Action plan to bridge the gap."
  },
  "industryReadiness": {
    "score": 8.5,
    "assessment": "Plain explanation of work preparation level."
  },
  "careerRoadmap": ["Roadmap step 1", "Roadmap step 2"]
}`;
    templateRules = `Focus on career matching, certifications, internship ideas, and skills to improve. Keep English simple, natural, and free of difficult corporate buzzwords.`;
  } else {
    allowedSections = 'Leadership, Career Transition, Executive Skills, Industry Trends, Growth Plan, Advanced Certifications';
    targetSchema = `{
  "reportTitle": "Executive Career Report",
  "executiveSummary": "Polished and encouraging transition/growth summary (100-140 words) for a working professional.",
  "leadership": {
    "style": "Description of leadership style based on personality answers.",
    "index": "Qualitative level (e.g. Strategic, Team-oriented)",
    "details": "Plain explanation of leadership strengths."
  },
  "careerTransition": [
    {
      "role": "Target role or transition area (e.g. Project Manager)",
      "whyItFits": "Why it fits based on responses.",
      "pivotStrategy": "Lateral growth or transition strategy details."
    }
  ],
  "executiveSkills": [
    { "skill": "Skill Name", "gapAction": "How to master this skill." }
  ],
  "industryTrends": {
    "automationRisk": "AI automation risk and outlook.",
    "futureDemand": "Future industry demand and trend details.",
    "marketDemand": "General market demand description."
  },
  "growthPlan": ["Growth milestone 1", "Growth milestone 2"],
  "advancedCertifications": ["Advanced executive courses, PMP, MBA, or specialized certifications."]
}`;
    templateRules = `Focus on career growth, transition strategies, advanced learning, and leadership styles. Keep vocabulary polished but simple, natural, and readable.`;
  }

  const prompt = `
You are an experienced, empathetic, human Career Counsellor writing a personal career report for "Aspireya Consulting".
Analyze the student assessment profile and EVERY individual response to write a warm, friendly, highly personal report.

Student Profile:
- Name: ${profile.displayName}
- Education Level: ${educationLevel}
- Specific Degree/Field of Study: ${profile.profile?.classOrQualification || 'Not Specified'}
- Location: ${profile.profile?.city || 'Not Specified'}, ${profile.profile?.state || 'Not Specified'}

Top 3 Matching Careers (calculated matching scores):
1. ${top3[0]?.careerName} (Match: ${top3[0]?.matchPercentage}%)
2. ${top3[1]?.careerName} (Match: ${top3[1]?.matchPercentage}%)
3. ${top3[2]?.careerName} (Match: ${top3[2]?.matchPercentage}%)

User Traits and Skills Scores (1-5 scale):
${JSON.stringify(matchResults.userTraits, null, 2)}

Student's Individual Question Responses:
${formattedAnswers}

CRITICAL EXPERIENCED CAREER COUNSELLOR LANGUAGE RULES (STRICT MANDATE):

1. HUMAN COUNSELLOR PERSONA:
- Write as an experienced, warm career counsellor talking directly and encouragingly to the student, parents, and teachers.
- NEVER sound like an AI model, automated algorithm, or academic researcher.

2. ABSOLUTE BAN ON ROBOTIC & FORMAL PHRASES:
- DO NOT USE ANY OF THESE ROBOTIC PHRASES:
  * "has shown interest"
  * "strong foundation"
  * "potential career fields include"
  * "with focused preparation"
  * "make informed choices"
  * "demonstrates aptitude"
  * "indicates suitability"
  * "cognitive aptitude"
  * "propensity for"
  * "analytical reasoning capability"
  * "interpersonal competencies"

3. NATURAL REPLACEMENTS (USE THIS STYLE):
  * Replace "She has shown interest in creative fields" -> "She enjoys creative work."
  * Replace "Research universities offering desired courses" -> "Compare different colleges before making your final choice."
  * Replace "Demonstrates aptitude for math" -> "Good at solving math problems."
  * Replace "Indicates suitability for engineering" -> "Fits well with engineering."
  * Replace "With focused preparation, the candidate can..." -> "With regular practice, you can..."

4. SHORT SENTENCES & SIMPLE ENGLISH:
- Keep every sentence short, simple, and direct.
- Language must be crystal clear for students (ages 15-18), parents, and teachers.

5. RESPONSE PRIORITY RULE:
- Support every conclusion with their actual responses. Never guess or invent conclusions without evidence in their answers.

6. CAREER RECOMMENDATION ADAPTATION (CRITICAL):
- If the student has a specific degree or field of study listed, you MUST adapt the "Top 3 Matching Careers" to be directly related to their actual field of study, while utilizing the traits from the matched careers.
- Do NOT blindly recommend a career that is completely unrelated to their field of study.
- For example, if they study "Biology" and matched with "Data Scientist", recommend "Bioinformatics Data Scientist".

7. TEMPLATE SCHEMA AND SECTION LIMITS:
- Your output JSON MUST contain ONLY the sections defined for this level.
- ALLOWED SECTIONS for this report: ${allowedSections}
- FORBIDDEN SECTIONS (DO NOT generate them, omit them completely): ${forbiddenSections}
- Template Wording Rules: ${templateRules}

Please output a JSON object containing the report details. The JSON object MUST strictly adhere to the following schema:
${targetSchema}

Before returning the final JSON, perform a self-review:
- Is the tone warm, natural, and encouraging?
- Did you eliminate every robotic phrase ("has shown interest", "strong foundation", "make informed choices", etc.)?
- Are sentences short and simple?
- Does it sound like a real human career counsellor wrote it personally?

Do NOT output any markdown tags or code blocks outside the JSON. Return only a valid JSON string.
`;

  // Production and Dev Retries loop (3 retries)
  let retries = 3;
  let text = '';

  while (retries > 0) {
    try {
      console.log(`Sending direct completion request to Groq SDK (Retries left: ${retries})...`);
      const completion = await aiClient.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: "You are an experienced human career counsellor outputting JSON. You use simple, warm, natural English and never use robotic or formal AI phrases."
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      });

      text = completion.choices[0]?.message?.content || '';
      text = text.trim();

      // Strip markdown code blocks
      if (text.startsWith('```json')) {
        text = text.substring(7, text.length - 3).trim();
      } else if (text.startsWith('```')) {
        text = text.substring(3, text.length - 3).trim();
      }

      const reportContent = JSON.parse(text);
      console.log("========== AI RESPONSE ==========");
      console.dir(reportContent, { depth: null });
      console.log("================================");

      const requiredFieldsByLevel = {
        class_5_8: [
          'reportTitle',
          'executiveSummary',
          'myInterests',
          'myStrengths',
          'myLearningStyle',
          'myFavouriteSubjects',
          'activitiesToExplore',
          'skillsICanImprove',
          'studyTips',
          'funLearningChallenges',
          'parentGuidance',
          'teacherGuidance',
          'learningPlan30Day'
        ],

        class_9_10: [
          'reportTitle',
          'executiveSummary',
          'subjectInterests',
          'streamSuggestions',
          'strengths',
          'learningStyle',
          'studyStrategy',
          'skillsToBuild',
          'activitiesToExplore',
          'parentGuidance',
          'teacherGuidance',
          'futureExploration'
        ],

        class_11_12: [
          'reportTitle',
          'executiveSummary',
          'careerFields',
          'degrees',
          'entranceExams',
          'roadmap',
          'skillDevelopment',
          'higherEducation'
        ],

        undergraduate: [
          'reportTitle',
          'executiveSummary',
          'careerPaths',
          'internships',
          'certifications',
          'skillGapAnalysis',
          'industryReadiness',
          'careerRoadmap'
        ],

        professional: [
          'reportTitle',
          'executiveSummary',
          'leadership',
          'careerTransition',
          'executiveSkills',
          'industryTrends',
          'growthPlan',
          'advancedCertifications'
        ]
      };

      const requiredFields =
        requiredFieldsByLevel[educationLevel] ||
        requiredFieldsByLevel.professional;

      const missingFields = requiredFields.filter(field => {
        const value = reportContent[field];

        if (value === undefined || value === null) {
          return true;
        }

        if (typeof value === 'string' && value.trim() === '') {
          return true;
        }

        if (Array.isArray(value) && value.length === 0) {
          return true;
        }

        if (
          typeof value === 'object' &&
          !Array.isArray(value) &&
          Object.keys(value).length === 0
        ) {
          return true;
        }

        return false;
      });

      if (missingFields.length > 0) {
        throw new Error(
          `AI report is incomplete. Missing or empty fields: ${missingFields.join(', ')}`
        );
      }

      return reportContent;
    } catch (error) {
      console.error(`AI Report Generation Attempt failed:`, error.message);
      retries--;
      if (retries === 0) {
        // If we are in production, fail hard and return error.
        if (process.env.NODE_ENV === 'production') {
          throw new Error(`Failed to generate personalized report in production. Details: ${error.message}`);
        }
        // In development/fallback mode, use mock report
        console.warn(`Falling back to mock report generator in development.`);
        return generateMockReport(profile, top3, matchResults.userTraits, educationLevel);
      }
    }
  }
};

export const generateMockReport = (profile, top3, userTraits, educationLevel) => {
  const isClass5to8 = educationLevel === "class_5_8";
  const isClass9to10 = educationLevel === "class_9_10";
  const isClass11to12 = educationLevel === "class_11_12";
  const isUndergrad = educationLevel === "undergraduate";

  if (isClass5to8) {
    return {
      reportTitle: "My Learning & Growth Report",
      executiveSummary: `${profile.displayName} loves learning how new things work and enjoys solving fun puzzles. They learn best by trying hands-on projects and exploring new ideas.`,
      myInterests: `${profile.displayName} enjoys science experiments, tech games, and creative play.`,
      myStrengths: [
        {
          strength: "Curious Learner",
          why: "Enjoys learning something new every single day."
        },
        {
          strength: "Problem Solver",
          why: "Likes solving brain games and puzzles."
        }
      ],
      myLearningStyle: "Learns best with pictures, charts, and simple hands-on tasks.",
      myFavouriteSubjects: ["Science", "Mathematics", "Computer Science"],
      activitiesToExplore: ["Join a school coding club", "Try simple science experiment kits", "Solve fun math games"],
      skillsICanImprove: [
        {
          skill: "Speaking in Groups",
          how: "Practice talking about favorite hobbies with family at home."
        }
      ],
      studyTips: [
        "Study in short 30-minute blocks with fun breaks.",
        "Draw pictures to remember new science ideas easily."
      ],
      funLearningChallenges: [
        "Build a small game in Scratch.",
        "Show a simple project at the school science fair."
      ],
      parentGuidance: "Encourage them to try different hobbies and games. Let them explore what they like without worrying about job choices yet.",
      teacherGuidance: "Give them fun hands-on tasks and puzzles to build their confidence.",
      learningPlan30Day: [
        "Week 1: Try a new puzzle game.",
        "Week 2: Draw a simple science idea.",
        "Week 3: Try basic Scratch coding.",
        "Week 4: Show your project to family."
      ]
    };
  }

  if (isClass9to10) {
    return {
      reportTitle: "Stream Exploration Report",
      executiveSummary: `${profile.displayName} likes science experiments and logical thinking. We recommend looking into the Science stream to build on what you enjoy.`,
      subjectInterests: "You enjoy Physics, Math, and digital technology.",
      streamSuggestions: [
        {
          stream: "Science Stream",
          suitability: "High",
          whyItFits: "Fits well because you enjoy math problems and science experiments."
        },
        {
          stream: "Commerce Stream",
          suitability: "Medium",
          whyItFits: "A good option if you want to learn about business, economics, and math."
        }
      ],
      strengths: [
        {
          name: "Logical Thinking",
          description: "Good at thinking carefully before making decisions."
        }
      ],
      learningStyle: "You learn best when taking clear notes and trying lab experiments.",
      studyStrategy: [
        "Practice math problems every day.",
        "Explain science ideas in your own words before tests."
      ],
      skillsToBuild: [
        {
          skill: "Basic Coding",
          howToBuild: "Try a simple beginner Python course online."
        }
      ],
      activitiesToExplore: [
        "Join the school computer club.",
        "Take part in science fairs."
      ],
      parentGuidance: "Support their interest in science and math. Help them try basic computer activities at home.",
      teacherGuidance: "Help them with science projects and give them extra problem-solving tasks.",
      futureExploration: "Read simple tech magazines and watch educational videos on web development."
    };
  }

  if (isClass11to12) {
    return {
      reportTitle: "Career Planning Report",
      executiveSummary: `${profile.displayName} enjoys solving math puzzles, writing code, and learning about computers. Focusing on software and technology will be a great path forward.`,
      careerFields: [
        {
          field: "Software Engineering & Computer Science",
          whyMatches: "You enjoy coding, solving logic problems, and building apps."
        }
      ],
      degrees: ["B.Tech in Computer Science", "BCA (Computer Applications)", "B.Sc Data Science"],
      entranceExams: ["JEE Main & Advanced", "BITSAT", "CUET-UG"],
      roadmap: [
        "Focus on Class 11-12 Physics and Math.",
        "Prepare for college entrance tests.",
        "Compare different colleges before making your final choice."
      ],
      skillDevelopment: [
        {
          skill: "Basic Programming",
          actionPlan: "Learn Python or Java during school breaks."
        }
      ],
      higherEducation: "Look for colleges with good computer labs, helpful teachers, and strong campus placements."
    };
  }

  if (isUndergrad) {
    return {
      reportTitle: "Career Intelligence Report",
      executiveSummary: `${profile.displayName} is ready to start building a career in software development. You like solving coding challenges and planning practical projects.`,
      careerPaths: [
        {
          career: "Software Developer",
          matchPercentage: 92,
          whyMatches: "Fits well because you enjoy coding and solving technical problems.",
          shortTermMilestones: [
            "Build 2 personal coding projects.",
            "Apply for a summer coding internship."
          ],
          longTermMilestones: [
            "Get a junior developer role.",
            "Learn cloud platform tools."
          ]
        }
      ],
      internships: ["Web Development Internship", "Open-source coding project contributor"],
      certifications: ["AWS Cloud Practitioner", "Google Web Developer Certificate"],
      skillGapAnalysis: {
        requiredSkills: ["Web Development", "Database Basics"],
        userGaps: ["Cloud Hosting Basics"],
        actionPlan: "Complete a hands-on online course on cloud hosting."
      },
      industryReadiness: {
        score: 8.5,
        assessment: "You are well-prepared for entry-level internships and junior roles."
      },
      careerRoadmap: [
        "Build an online portfolio website.",
        "Practice interview coding questions daily."
      ]
    };
  }

  // Professional Template Fallback
  return {
    reportTitle: "Executive Career Report",
    executiveSummary: `${profile.displayName} is ready to step into team lead or project management roles. You work well with people and enjoy planning clear project goals.`,
    leadership: {
      style: "Supportive & Clear",
      index: "Strategic",
      details: "You are good at guiding team members and keeping project goals on track."
    },
    careerTransition: [
      {
        role: "Tech Project Lead",
        whyItFits: "Fits well because you enjoy organizing tasks and guiding team members.",
        pivotStrategy: "Take charge of small feature deliveries in your current role."
      }
    ],
    executiveSkills: [
      {
        skill: "Agile Project Planning",
        gapAction: "Take a short certified Scrum Master training course."
      }
    ],
    industryTrends: {
      automationRisk: "Routine coding will be automated by AI, but leading teams and project planning remain in high demand.",
      futureDemand: "Strong demand for leaders who connect tech teams with business goals.",
      marketDemand: "High need for practical project managers and Scrum leaders."
    },
    growthPlan: [
      "Get a Scrum Master or PMP certification.",
      "Lead cross-functional feature teams at work."
    ],
    advancedCertifications: ["Certified ScrumMaster (CSM)", "PMP Certification Prep"]
  };
};
