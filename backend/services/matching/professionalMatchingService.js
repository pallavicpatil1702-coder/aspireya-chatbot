import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { likertScore } from '../scoringService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const matrixPath = path.join(__dirname, '../../data/careerMatrices/professional_Matrix.json');
const careerMatrix = JSON.parse(fs.readFileSync(matrixPath, 'utf8'));

const INTEREST_SCORE_WEIGHT = 0.40;
const TRAIT_COMPATIBILITY_WEIGHT = 0.60;

export const matchProfessionalCareers = (answers, questions) => {
  const answerMap = new Map(answers.map(a => [Number(a.questionId), a.answer]));

  const traitScores = {};
  const traitCounts = {};

  const matrixTraits = new Set();
  Object.values(careerMatrix).forEach(career => {
    Object.keys(career).forEach(trait => matrixTraits.add(trait));
  });

  matrixTraits.forEach(trait => {
    traitScores[trait] = 0;
    traitCounts[trait] = 0;
  });

  const careerInterests = {};
  const careerInterestsCounts = {};

  const categoryScores = { "Technology": 0, "Creativity": 0, "Business": 0, "Healthcare": 0 };
  const careerToCategoryMap = {
    "Software Engineer": "Technology",
    "AI Engineer": "Technology",
    "Data Scientist": "Technology",
    "Cyber Security Analyst": "Technology",
    "Cyber Security": "Technology",
    "Doctor": "Healthcare",
    "Psychologist": "Healthcare",
    "Teacher": "Creativity",
    "Lawyer": "Creativity",
    "Entrepreneur": "Business",
    "Chartered Accountant": "Business"
  };

  questions.forEach(q => {
    const answer = answerMap.get(Number(q.id));
    if (answer === undefined || answer === null) return;

    // 1. Process Interests
    if (q.section === 'Career Interests' && q.careerMapping) {
      const score = likertScore(answer, q.reverse);
      Object.entries(q.careerMapping).forEach(([careerName, weight]) => {
        if (!careerInterests[careerName]) {
          careerInterests[careerName] = 0;
          careerInterestsCounts[careerName] = 0;
        }
        careerInterests[careerName] += score * weight;
        careerInterestsCounts[careerName] += 5 * weight;

        const category = careerToCategoryMap[careerName] || "Creativity";
        categoryScores[category] += score * weight;
      });
    }

    // 2. Process Traits (uses q.trait)
    if (q.section !== 'Career Interests' && q.trait && matrixTraits.has(q.trait)) {
      let score = 0;
      if (q.type === 'mcq') {
        let isCorrect = false;
        if (typeof q.correctAnswer === 'number') {
          const opt = q.options?.[q.correctAnswer];
          if (opt) {
            isCorrect = (opt === answer);
          }
        } else {
          isCorrect = (answer === q.correctAnswer);
        }
        score = isCorrect ? 5 : 1;
      } else {
        score = likertScore(answer, q.reverse);
      }
      traitScores[q.trait] += score;
      traitCounts[q.trait] += 1;
    }
  });

  const userTraits = {};
  matrixTraits.forEach(trait => {
    if (traitCounts[trait] > 0) {
      userTraits[trait] = traitScores[trait] / traitCounts[trait];
    } else {
      userTraits[trait] = 3.0; // default neutral
    }
  });

  let strongestCategory = "Technology";
  let maxCatScore = -1;
  Object.entries(categoryScores).forEach(([cat, score]) => {
    if (score > maxCatScore) {
      maxCatScore = score;
      strongestCategory = cat;
    }
  });

  const recommendations = [];
  Object.entries(careerMatrix).forEach(([careerName, requirements]) => {
    // A. Traits Compatibility
    let scoreSum = 0;
    let weightSum = 0;
    Object.entries(requirements).forEach(([trait, requiredLevel]) => {
      const userLevel = userTraits[trait] || 3.0;
      const diff = Math.abs(userLevel - requiredLevel);
      const traitCompatibility = Math.max(0, 100 - (diff / 4) * 100);
      scoreSum += traitCompatibility * requiredLevel;
      weightSum += requiredLevel;
    });
    const matrixScore = weightSum > 0 ? (scoreSum / weightSum) : 50;

    // B. Interest Score
    const actualInterest = careerInterests[careerName] || 0;
    const maxInterest = careerInterestsCounts[careerName] || 0;
    const interestScore = maxInterest > 0 ? (actualInterest / maxInterest) * 100 : 50;

    // C. Combine
    const rawMatchScore = (INTEREST_SCORE_WEIGHT * interestScore) +
      (TRAIT_COMPATIBILITY_WEIGHT * matrixScore);

    // Widen distribution to avoid clustering in the 85-90% range
    // Applies a 2.5x multiplier to the deficit from 100% to create better differentiation
    const widenedScore = Math.max(0, 100 - ((100 - rawMatchScore) * 2.5));
    const finalMatchScore = Math.round(widenedScore);

    // D. Compute Trait Boost & Sort Score
    let traitBoost = 0;
    Object.entries(requirements).forEach(([trait, requiredLevel]) => {
      const userLevel = userTraits[trait] || 3.0;
      if (userLevel > 3.0 && requiredLevel >= 4) {
        traitBoost += (userLevel - 3.0) * requiredLevel;
      }
      if (userLevel < 3.0 && requiredLevel >= 4) {
        traitBoost -= (3.0 - userLevel) * requiredLevel;
      }
      if (userLevel < 3.0 && requiredLevel <= 2) {
        traitBoost += (3.0 - userLevel) * (3 - requiredLevel);
      }
      if (userLevel > 3.0 && requiredLevel <= 2) {
        traitBoost -= (userLevel - 3.0) * (3 - requiredLevel);
      }
    });

    const clampedTraitBoost = Math.min(20, Math.max(-20, traitBoost));
    const interestBoost = (interestScore - 50) * 0.02;
    const personalityBoost = clampedTraitBoost * 0.07;
    const totalBoost = interestBoost + personalityBoost;
    const sortScore = finalMatchScore + totalBoost;

    recommendations.push({
      careerName,
      matchPercentage: Math.min(100, Math.max(0, finalMatchScore)),
      sortScore,
      traitsAnalysis: Object.keys(requirements).reduce((acc, trait) => {
        acc[trait] = {
          required: requirements[trait],
          userScore: Number(userTraits[trait].toFixed(1))
        };
        return acc;
      }, {})
    });
  });

  recommendations.sort((a, b) => {
    const sortScoreDiff = b.sortScore - a.sortScore;
    if (Math.abs(sortScoreDiff) < 0.5) {
      const aCategory = careerToCategoryMap[a.careerName] || "Creativity";
      const bCategory = careerToCategoryMap[b.careerName] || "Creativity";

      const aIsStrongest = (aCategory === strongestCategory);
      const bIsStrongest = (bCategory === strongestCategory);

      if (aIsStrongest && !bIsStrongest) {
        return -1;
      }
      if (!aIsStrongest && bIsStrongest) {
        return 1;
      }
    }
    return sortScoreDiff;
  });

  recommendations.forEach(r => delete r.sortScore);

  return {
    recommendations,
    userTraits: Object.entries(userTraits).reduce((acc, [trait, score]) => {
      acc[trait] = Number(score.toFixed(1));
      return acc;
    }, {})
  };
};
