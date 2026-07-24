import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { firestoreDb } from "../config/firebase.js";
import schoolQuestions from "../data/schoolAssessmentQuestions.js";

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

export const getAssessmentQuestions = async (req, res) => {
  try {
    const { uid } = req.user;
    const { type } = req.query;
    let assessmentType = type;

    if (!assessmentType) {
      const userDoc = await firestoreDb.collection("users").doc(uid).get();
      if (userDoc.exists) {
        assessmentType = classifyUserType(userDoc.data());
      }
    }

    console.log(`Requested/classified assessment type: ${assessmentType} for user ${uid}`);

    if (!assessmentType || assessmentType === "undetermined") {
      return res.status(200).json({
        assessmentType: "undetermined",
        message: "Please choose your assessment type."
      });
    }

    if (assessmentType === "class_5_8" || assessmentType === "class_9_10" || assessmentType === "student_8_10") {
      const sections = [
        { name: "Career Interests", range: [0, 14] },
        { name: "Personality", range: [15, 29] },
        { name: "Skills", range: [30, 44] },
        { name: "Learning Style", range: [45, 59] },
        { name: "Values & Motivation", range: [60, 74] },
        { name: "Career Aptitude", range: [75, 89] }
      ];
      return res.status(200).json({
        assessmentType: assessmentType === "student_8_10" ? "class_9_10" : assessmentType,
        sections,
        questions: schoolQuestions
      });
    }

    if (assessmentType === "class_11_12" || assessmentType === "student_11_12") {
      const filePath = path.join(__dirname, "../data/highSchoolAssessmentQuestions.json");
      const questions = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const sections = [
        { name: "Career Interests", range: [0, 14] },
        { name: "Personality", range: [15, 29] },
        { name: "Learning Style", range: [30, 44] },
        { name: "Academic Strengths & Aptitude", range: [45, 59] },
        { name: "Values & Motivation", range: [60, 74] },
        { name: "Career Readiness", range: [75, 89] }
      ];
      return res.status(200).json({
        assessmentType: "class_11_12",
        sections,
        questions
      });
    }

    if (assessmentType === "undergraduate" || assessmentType === "professional") {
      const filePath = path.join(__dirname, "../data/professionalAssessmentQuestions.json");
      const questions = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const sections = [
        { name: "Career Interests", range: [0, 14] },
        { name: "Personality & Behaviour", range: [15, 29] },
        { name: "Learning Style", range: [30, 44] },
        { name: "Skills & Aptitude", range: [45, 59] },
        { name: "Values & Motivation", range: [60, 74] },
        { name: "Career Readiness", range: [75, 89] }
      ];
      return res.status(200).json({
        assessmentType,
        sections,
        questions
      });
    }

    return res.status(400).json({ error: "Invalid assessment type requested." });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to load assessment questions"
    });
  }
};