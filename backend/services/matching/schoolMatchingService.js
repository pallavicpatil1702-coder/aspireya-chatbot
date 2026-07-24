import { careerMatrix } from '../../data/careerMatrix.js';
import { likertScore } from '../scoringService.js';

const INTEREST_SCORE_WEIGHT = 0.40;
const TRAIT_COMPATIBILITY_WEIGHT = 0.60;

const studentCategoryToCareers = {
  "Technology": ["Software Engineer", "AI Engineer", "Data Scientist", "Cyber Security Analyst"],
  "Engineering": ["Software Engineer", "AI Engineer"],
  "AI": ["AI Engineer"],
  "Data Science": ["Data Scientist"],
  "Cyber Security": ["Cyber Security Analyst"],
  "Software Engineering": ["Software Engineer"],
  "Research": ["AI Engineer", "Data Scientist", "Psychologist"],
  "Science": ["Doctor", "Psychologist", "AI Engineer", "Data Scientist"],
  "Healthcare": ["Doctor", "Psychologist"],
  "Education": ["Teacher"],
  "Business": ["Entrepreneur"],
  "Finance": ["Chartered Accountant"],
  "Design": ["Software Engineer"],
  "Media": ["Teacher", "Entrepreneur"],
  "Sports": ["Psychologist"],
  "Agriculture": ["Entrepreneur"],
  "Social Service": ["Teacher", "Psychologist"],
  "Government": ["Lawyer", "Chartered Accountant"]
};

export const matchSchoolCareers = (answers, questions) => {
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

  questions.forEach(q => {
    const answer = answerMap.get(Number(q.id));
    if (answer === undefined || answer === null) return;

    // 1. Process Interests (uses array-based category mapping for 8-10th)
    if (q.section === 'Career Interests' && q.careerMapping) {
      if (q.type === 'likert') {
        const score = likertScore(answer, q.reverse);
        q.careerMapping.forEach(category => {
          const careers = studentCategoryToCareers[category] || [];
          careers.forEach(careerName => {
            if (!careerInterests[careerName]) {
              careerInterests[careerName] = 0;
              careerInterestsCounts[careerName] = 0;
            }
            careerInterests[careerName] += score;
            careerInterestsCounts[careerName] += 5;
          });
        });
      } else {
        // Scenario/MCQ
        const options = q.options || [];
        const index = options.findIndex(opt => {
          if (typeof opt === 'object') {
            return opt.en === answer || opt.value === answer;
          }
          return opt === answer;
        });
        if (index !== -1 && q.careerMapping[index]) {
          const category = q.careerMapping[index];
          const careers = studentCategoryToCareers[category] || [];
          careers.forEach(careerName => {
            if (!careerInterests[careerName]) {
              careerInterests[careerName] = 0;
              careerInterestsCounts[careerName] = 0;
            }
            careerInterests[careerName] += 5;
            careerInterestsCounts[careerName] += 5;
          });
        }
      }
    }

    // 2. Process Traits (uses q.trait directly)
    if (q.section !== 'Career Interests' && q.trait && matrixTraits.has(q.trait)) {
      let score = 0;
      if (q.type === 'mcq') {
        let isCorrect = false;
        if (typeof q.correctAnswer === 'number') {
          const opt = q.options?.[q.correctAnswer];
          if (opt) {
            isCorrect = (typeof opt === 'object' ? (opt.en === answer || opt.value === answer) : opt === answer);
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
      userTraits[trait] = 3.0;
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
    const finalMatchScore = Math.round(
      (INTEREST_SCORE_WEIGHT * interestScore) + 
      (TRAIT_COMPATIBILITY_WEIGHT * matrixScore)
    );

    recommendations.push({
      careerName,
      matchPercentage: Math.min(100, Math.max(0, finalMatchScore)),
      traitsAnalysis: Object.keys(requirements).reduce((acc, trait) => {
        acc[trait] = {
          required: requirements[trait],
          userScore: Number(userTraits[trait].toFixed(1))
        };
        return acc;
      }, {})
    });
  });

  recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return {
    recommendations,
    userTraits: Object.entries(userTraits).reduce((acc, [trait, score]) => {
      acc[trait] = Number(score.toFixed(1));
      return acc;
    }, {})
  };
};
