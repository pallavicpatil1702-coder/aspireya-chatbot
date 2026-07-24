import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { firestoreDb } from '../config/firebase.js';
import { matchCareers } from '../services/careerMatchingService.js';
import { generateAIReport } from '../services/reportService.js';
import schoolQuestions from '../data/schoolAssessmentQuestions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const classifyUserType = (profile) => {
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

export const submitAssessment = async (req, res) => {
  const { uid } = req.user;
  const { answers, assessmentType: bodyAssessmentType } = req.body;

  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: "Answers array is required." });
  }

  try {
    // 1. Fetch User Profile from Firestore to customize report
    const userDoc = await firestoreDb.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return res.status(400).json({ error: "Please complete onboarding before submitting the assessment." });
    }
    const profile = userDoc.data();

    // 2. Fetch the correct question set
    let questions;

    // Use the education level saved in the user's profile
    const profileAssessmentType = classifyUserType(profile);

    const allowedAssessmentTypes = [
      'class_5_8',
      'class_9_10',
      'class_11_12',
      'undergraduate',
      'professional'
    ];

    let assessmentType = profileAssessmentType;

    // Use frontend assessment type only when it matches the profile
    if (
      bodyAssessmentType &&
      allowedAssessmentTypes.includes(bodyAssessmentType) &&
      bodyAssessmentType === profileAssessmentType
    ) {
      assessmentType = bodyAssessmentType;
    }

    console.log(`Processing report submission for assessment type: ${assessmentType} for user ${uid}`);

    if (assessmentType === "undetermined" || !assessmentType) {
      return res.status(400).json({ error: "Assessment type could not be determined. Please specify assessmentType." });
    }

    if (assessmentType === 'class_5_8' || assessmentType === 'class_9_10' || assessmentType === 'student_8_10') {
      questions = schoolQuestions;
    } else if (assessmentType === 'class_11_12' || assessmentType === 'student_11_12') {
      const questionsPath = path.join(__dirname, '../data/highSchoolAssessmentQuestions.json');
      questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
    } else {
      const questionsPath = path.join(__dirname, '../data/professionalAssessmentQuestions.json');
      questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
    }

    // 3. Map selected answers with full question metadata
    const answersMap = new Map(
      answers.map(answer => [
        String(answer.questionId),
        answer.answer
      ])
    );

    const answersWithMetadata = questions
      .map(question => {
        const selectedAnswer = answersMap.get(String(question.id));

        if (
          selectedAnswer === undefined ||
          selectedAnswer === null ||
          selectedAnswer === ''
        ) {
          return null;
        }

        return {
          questionId: question.id,

          questionText:
            question.question?.en ||
            question.question ||
            'Question text unavailable',

          category:
            question.section ||
            question.category ||
            'General',

          trait:
            question.trait ||
            null,

          weight:
            question.weight ??
            question.careerMapping ??
            null,

          reverseScoring:
            Boolean(
              question.reverseScoring ??
              question.reverse
            ),

          selectedAnswer
        };
      })
      .filter(Boolean);

    if (answersWithMetadata.length === 0) {
      return res.status(400).json({
        error: 'No valid answers were found for this assessment.'
      });
    }

    // 4. Compute Career Match Scores using the selected matching service via routing helper
    let matchResults;

    if (assessmentType === 'class_5_8') {
      matchResults = {
        recommendations: [],
        userTraits: {},
        explorationOnly: true
      };
    } else {
      matchResults = matchCareers(
        answers,
        questions,
        assessmentType
      );
    }

    // 5. Generate AI Report (with direct Groq API or mock fallback)
    const reportContent = await generateAIReport(
      profile,
      matchResults,
      answersWithMetadata,
      assessmentType
    );

    // 6. Build final report document
    const reportRef = firestoreDb.collection('reports').doc();
    const generatedReportId = reportRef.id;
    const normalizedEmail = profile.email ? profile.email.trim().toLowerCase() : profile.email;
    const createdAt = new Date().toISOString();

    const finalReport = {
      reportId: generatedReportId,
      uid,
      email: normalizedEmail,
      assessmentType,
      userName: profile.displayName,
      timestamp: new Date().toISOString(),
      createdAt,
      matchResults: matchResults.recommendations.map(r => ({
        careerName: r.careerName,
        matchPercentage: r.matchPercentage
      })),
      userTraits: matchResults.userTraits,
      reportContent,
      isPremium: profile.isPremium || false
    };

    // 7. Save report to Firestore reports collection using the generated unique ID
    await reportRef.set(finalReport);

    res.status(200).json(finalReport);
  } catch (error) {
    console.error("Error in submitAssessment:", error);
    res.status(500).json({ error: "Failed to generate report", details: error.message });
  }
};

export const getReport = async (req, res) => {
  const { uid } = req.user;

  try {
    let reportDoc = null;

    try {
      // Attempt to get the latest generated report based on uid
      // This requires a composite index in production.
      const querySnapshot = await firestoreDb.collection('reports')
        .where('uid', '==', uid)
        .orderBy('timestamp', 'desc')
        .limit(1)
        .get();
        
      if (!querySnapshot.empty) {
        reportDoc = querySnapshot.docs[0];
      }
    } catch (queryError) {
      console.warn("Index may be missing for reports query, falling back to legacy doc fetch:", queryError.message);
    }
    
    if (!reportDoc) {
      // Fallback: check legacy report stored directly with the uid as the doc id
      const legacyDoc = await firestoreDb.collection('reports').doc(uid).get();
      if (legacyDoc.exists) {
        reportDoc = legacyDoc;
      }
    }

    if (!reportDoc) {
      return res.status(404).json({ error: "No assessment report found. Please take the assessment first." });
    }

    const userDoc = await firestoreDb.collection('users').doc(uid).get();
    const isPremium = userDoc.exists ? (userDoc.data().isPremium || false) : false;

    const reportData = reportDoc.data();
    reportData.isPremium = isPremium;

    res.status(200).json(reportData);
  } catch (error) {
    console.error("Error in getReport:", error);
    res.status(500).json({ error: "Failed to retrieve report", details: error.message });
  }
};

export const upgradeToPremium = async (req, res) => {
  const { uid } = req.user;
  try {
    const userRef = firestoreDb.collection('users').doc(uid);
    await userRef.set({ isPremium: true }, { merge: true });

    const reportRef = firestoreDb.collection('reports').doc(uid);
    const reportDoc = await reportRef.get();
    if (reportDoc.exists) {
      await reportRef.update({ isPremium: true });
    }

    res.status(200).json({ success: true, message: "Successfully upgraded to premium." });
  } catch (error) {
    console.error("Error in upgradeToPremium:", error);
    res.status(500).json({ error: "Failed to upgrade to premium." });
  }
};
