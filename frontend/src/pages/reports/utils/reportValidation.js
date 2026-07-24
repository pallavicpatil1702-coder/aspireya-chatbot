import { resolveReportType } from './reportTypeResolver.js';

/**
 * Checks if a value is a finite number.
 */
const isFiniteNumber = (val) => typeof val === 'number' && Number.isFinite(val);

/**
 * 1. Class 5-8 Validator
 * Preserves all rawContent properties while normalizing known fields.
 */
export const validateClass58 = (rawContent = {}) => {
  if (!rawContent || typeof rawContent !== 'object') return {};

  const normalizedKnownFields = {
    reportTitle: typeof rawContent.reportTitle === 'string' && rawContent.reportTitle.trim()
      ? rawContent.reportTitle.trim()
      : "My Learning & Growth Report",
    executiveSummary: typeof rawContent.executiveSummary === 'string'
      ? rawContent.executiveSummary.trim()
      : "",
    myInterests: typeof rawContent.myInterests === 'string'
      ? rawContent.myInterests.trim()
      : "",
    myStrengths: Array.isArray(rawContent.myStrengths)
      ? rawContent.myStrengths.map(s => {
          if (typeof s === 'string') return { strength: s.trim(), why: "" };
          if (s && typeof s === 'object') {
            return {
              strength: (s.strength || s.title || s.name || s.trait || "").trim(),
              why: (s.why || s.description || s.reason || "").trim()
            };
          }
          return null;
        }).filter(Boolean)
      : [],
    myLearningStyle: typeof rawContent.myLearningStyle === 'string'
      ? rawContent.myLearningStyle.trim()
      : "",
    myFavouriteSubjects: Array.isArray(rawContent.myFavouriteSubjects)
      ? rawContent.myFavouriteSubjects.filter(item => typeof item === 'string' && item.trim())
      : [],
    activitiesToExplore: Array.isArray(rawContent.activitiesToExplore)
      ? rawContent.activitiesToExplore.filter(item => typeof item === 'string' && item.trim())
      : [],
    skillsICanImprove: Array.isArray(rawContent.skillsICanImprove)
      ? rawContent.skillsICanImprove.map(sk => {
          if (typeof sk === 'string') return { skill: sk.trim(), how: "" };
          if (sk && typeof sk === 'object') {
            return {
              skill: (sk.skill || sk.name || "").trim(),
              how: (sk.how || sk.howToBuild || sk.actionItem || "").trim()
            };
          }
          return null;
        }).filter(Boolean)
      : [],
    studyTips: Array.isArray(rawContent.studyTips)
      ? rawContent.studyTips.filter(item => typeof item === 'string' && item.trim())
      : [],
    funLearningChallenges: Array.isArray(rawContent.funLearningChallenges)
      ? rawContent.funLearningChallenges.filter(item => typeof item === 'string' && item.trim())
      : [],
    parentGuidance: typeof rawContent.parentGuidance === 'string'
      ? rawContent.parentGuidance.trim()
      : "",
    teacherGuidance: typeof rawContent.teacherGuidance === 'string'
      ? rawContent.teacherGuidance.trim()
      : "",
    learningPlan30Day: Array.isArray(rawContent.learningPlan30Day)
      ? rawContent.learningPlan30Day.filter(item => typeof item === 'string' && item.trim())
      : []
  };

  return {
    ...rawContent,
    ...normalizedKnownFields
  };
};

/**
 * 2. Class 9-10 & student_8_10 Validator
 * Preserves all rawContent properties while normalizing known fields.
 */
export const validateClass910 = (rawContent = {}) => {
  if (!rawContent || typeof rawContent !== 'object') return {};

  const normalizedKnownFields = {
    reportTitle: typeof rawContent.reportTitle === 'string' && rawContent.reportTitle.trim()
      ? rawContent.reportTitle.trim()
      : "Stream Exploration Report",
    executiveSummary: typeof rawContent.executiveSummary === 'string'
      ? rawContent.executiveSummary.trim()
      : "",
    subjectInterests: typeof rawContent.subjectInterests === 'string'
      ? rawContent.subjectInterests.trim()
      : "",
    streamSuggestions: Array.isArray(rawContent.streamSuggestions)
      ? rawContent.streamSuggestions.map(st => {
          if (st && typeof st === 'object') {
            return {
              stream: typeof st.stream === 'string' ? st.stream.trim() : "",
              suitability: typeof st.suitability === 'string' ? st.suitability.trim() : "",
              whyItFits: typeof st.whyItFits === 'string' ? st.whyItFits.trim() : ""
            };
          }
          return null;
        }).filter(Boolean)
      : [],
    strengths: Array.isArray(rawContent.strengths)
      ? rawContent.strengths.map(s => {
          if (typeof s === 'string') return { name: s.trim(), description: "" };
          if (s && typeof s === 'object') {
            return {
              name: (s.name || s.title || s.trait || "").trim(),
              description: (s.description || s.why || s.reason || "").trim()
            };
          }
          return null;
        }).filter(Boolean)
      : Array.isArray(rawContent.keyStrengths)
        ? rawContent.keyStrengths.map(s => {
            if (s && typeof s === 'object') {
              return {
                name: (s.trait || s.strength || s.name || "").trim(),
                description: (s.description || s.why || "").trim()
              };
            }
            return null;
          }).filter(Boolean)
        : [],
    learningStyle: typeof rawContent.learningStyle === 'string'
      ? rawContent.learningStyle.trim()
      : "",
    studyStrategy: Array.isArray(rawContent.studyStrategy)
      ? rawContent.studyStrategy.filter(item => typeof item === 'string' && item.trim())
      : [],
    skillsToBuild: Array.isArray(rawContent.skillsToBuild)
      ? rawContent.skillsToBuild.map(sk => {
          if (typeof sk === 'string') return { skill: sk.trim(), howToBuild: "" };
          if (sk && typeof sk === 'object') {
            return {
              skill: (sk.skill || sk.name || "").trim(),
              howToBuild: (sk.howToBuild || sk.how || sk.actionItem || "").trim()
            };
          }
          return null;
        }).filter(Boolean)
      : [],
    activitiesToExplore: Array.isArray(rawContent.activitiesToExplore)
      ? rawContent.activitiesToExplore.filter(item => typeof item === 'string' && item.trim())
      : [],
    parentGuidance: typeof rawContent.parentGuidance === 'string'
      ? rawContent.parentGuidance.trim()
      : "",
    teacherGuidance: typeof rawContent.teacherGuidance === 'string'
      ? rawContent.teacherGuidance.trim()
      : "",
    futureExploration: typeof rawContent.futureExploration === 'string'
      ? rawContent.futureExploration.trim()
      : ""
  };

  return {
    ...rawContent,
    ...normalizedKnownFields
  };
};

/**
 * 3. Class 11-12 & student_11_12 Validator
 * Preserves all rawContent properties while normalizing known fields.
 */
export const validateClass1112 = (rawContent = {}) => {
  if (!rawContent || typeof rawContent !== 'object') return {};

  const normalizedKnownFields = {
    reportTitle: typeof rawContent.reportTitle === 'string' && rawContent.reportTitle.trim()
      ? rawContent.reportTitle.trim()
      : "Career Planning Report",
    executiveSummary: typeof rawContent.executiveSummary === 'string'
      ? rawContent.executiveSummary.trim()
      : "",
    careerFields: Array.isArray(rawContent.careerFields)
      ? rawContent.careerFields.map(f => {
          if (typeof f === 'string') return { field: f.trim(), whyMatches: "" };
          if (f && typeof f === 'object') {
            return {
              field: (f.field || f.career || "").trim(),
              whyMatches: (f.whyMatches || f.why || f.description || "").trim()
            };
          }
          return null;
        }).filter(Boolean)
      : [],
    degrees: Array.isArray(rawContent.degrees)
      ? rawContent.degrees.filter(item => typeof item === 'string' && item.trim())
      : [],
    entranceExams: Array.isArray(rawContent.entranceExams)
      ? rawContent.entranceExams.filter(item => typeof item === 'string' && item.trim())
      : [],
    roadmap: Array.isArray(rawContent.roadmap)
      ? rawContent.roadmap.filter(item => typeof item === 'string' && item.trim())
      : [],
    skillDevelopment: Array.isArray(rawContent.skillDevelopment)
      ? rawContent.skillDevelopment.map(sk => {
          if (typeof sk === 'string') return { skill: sk.trim(), actionPlan: "" };
          if (sk && typeof sk === 'object') {
            return {
              skill: (sk.skill || sk.name || "").trim(),
              actionPlan: (sk.actionPlan || sk.howToBuild || sk.how || "").trim()
            };
          }
          return null;
        }).filter(Boolean)
      : [],
    higherEducation: typeof rawContent.higherEducation === 'string'
      ? rawContent.higherEducation.trim()
      : ""
  };

  return {
    ...rawContent,
    ...normalizedKnownFields
  };
};

/**
 * 4. Undergraduate Validator
 * Preserves all rawContent properties while normalizing known fields.
 */
export const validateUndergraduate = (rawContent = {}) => {
  if (!rawContent || typeof rawContent !== 'object') return {};

  const normalizedKnownFields = {
    reportTitle: typeof rawContent.reportTitle === 'string' && rawContent.reportTitle.trim()
      ? rawContent.reportTitle.trim()
      : "Work Preparation & Career Report",
    executiveSummary: typeof rawContent.executiveSummary === 'string'
      ? rawContent.executiveSummary.trim()
      : "",
    careerPaths: Array.isArray(rawContent.careerPaths)
      ? rawContent.careerPaths.map(cp => {
          if (cp && typeof cp === 'object') {
            return {
              career: (cp.career || cp.title || cp.name || "").trim(),
              matchPercentage: isFiniteNumber(cp.matchPercentage) ? cp.matchPercentage : 0,
              whyMatches: (cp.whyMatches || cp.why || "").trim(),
              shortTermMilestones: Array.isArray(cp.shortTermMilestones)
                ? cp.shortTermMilestones.filter(m => typeof m === 'string' && m.trim())
                : [],
              longTermMilestones: Array.isArray(cp.longTermMilestones)
                ? cp.longTermMilestones.filter(m => typeof m === 'string' && m.trim())
                : []
            };
          }
          return null;
        }).filter(Boolean)
      : [],
    internships: Array.isArray(rawContent.internships)
      ? rawContent.internships.filter(item => typeof item === 'string' && item.trim())
      : [],
    certifications: Array.isArray(rawContent.certifications)
      ? rawContent.certifications.filter(item => typeof item === 'string' && item.trim())
      : [],
    skillGapAnalysis: rawContent.skillGapAnalysis && typeof rawContent.skillGapAnalysis === 'object'
      ? {
          requiredSkills: Array.isArray(rawContent.skillGapAnalysis.requiredSkills)
            ? rawContent.skillGapAnalysis.requiredSkills.filter(s => typeof s === 'string' && s.trim())
            : [],
          userGaps: Array.isArray(rawContent.skillGapAnalysis.userGaps)
            ? rawContent.skillGapAnalysis.userGaps.filter(s => typeof s === 'string' && s.trim())
            : [],
          actionPlan: typeof rawContent.skillGapAnalysis.actionPlan === 'string'
            ? rawContent.skillGapAnalysis.actionPlan.trim()
            : ""
        }
      : { requiredSkills: [], userGaps: [], actionPlan: "" },
    industryReadiness: rawContent.industryReadiness && typeof rawContent.industryReadiness === 'object'
      ? {
          score: isFiniteNumber(rawContent.industryReadiness.score) ? rawContent.industryReadiness.score : 0,
          assessment: typeof rawContent.industryReadiness.assessment === 'string'
            ? rawContent.industryReadiness.assessment.trim()
            : ""
        }
      : { score: 0, assessment: "" },
    careerRoadmap: Array.isArray(rawContent.careerRoadmap)
      ? rawContent.careerRoadmap.filter(item => typeof item === 'string' && item.trim())
      : []
  };

  return {
    ...rawContent,
    ...normalizedKnownFields
  };
};

/**
 * 5. Professional Validator
 * Preserves all rawContent properties while normalizing known fields.
 */
export const validateProfessional = (rawContent = {}) => {
  if (!rawContent || typeof rawContent !== 'object') return {};

  const normalizedKnownFields = {
    reportTitle: typeof rawContent.reportTitle === 'string' && rawContent.reportTitle.trim()
      ? rawContent.reportTitle.trim()
      : "Executive Career Report",
    executiveSummary: typeof rawContent.executiveSummary === 'string'
      ? rawContent.executiveSummary.trim()
      : "",
    leadership: rawContent.leadership && typeof rawContent.leadership === 'object'
      ? {
          style: typeof rawContent.leadership.style === 'string' ? rawContent.leadership.style.trim() : "",
          index: typeof rawContent.leadership.index === 'string' ? rawContent.leadership.index.trim() : "",
          details: typeof rawContent.leadership.details === 'string' ? rawContent.leadership.details.trim() : ""
        }
      : { style: "", index: "", details: "" },
    careerTransition: Array.isArray(rawContent.careerTransition)
      ? rawContent.careerTransition.map(ct => {
          if (ct && typeof ct === 'object') {
            return {
              role: (ct.role || ct.title || "").trim(),
              whyItFits: (ct.whyItFits || ct.why || "").trim(),
              pivotStrategy: (ct.pivotStrategy || ct.strategy || "").trim()
            };
          }
          return null;
        }).filter(Boolean)
      : [],
    executiveSkills: Array.isArray(rawContent.executiveSkills)
      ? rawContent.executiveSkills.map(sk => {
          if (sk && typeof sk === 'object') {
            return {
              skill: (sk.skill || sk.name || "").trim(),
              gapAction: (sk.gapAction || sk.action || "").trim()
            };
          }
          return null;
        }).filter(Boolean)
      : [],
    industryTrends: rawContent.industryTrends && typeof rawContent.industryTrends === 'object'
      ? {
          automationRisk: typeof rawContent.industryTrends.automationRisk === 'string'
            ? rawContent.industryTrends.automationRisk.trim()
            : "",
          futureDemand: typeof rawContent.industryTrends.futureDemand === 'string'
            ? rawContent.industryTrends.futureDemand.trim()
            : "",
          marketDemand: typeof rawContent.industryTrends.marketDemand === 'string'
            ? rawContent.industryTrends.marketDemand.trim()
            : ""
        }
      : { automationRisk: "", futureDemand: "", marketDemand: "" },
    growthPlan: Array.isArray(rawContent.growthPlan)
      ? rawContent.growthPlan.filter(item => typeof item === 'string' && item.trim())
      : [],
    advancedCertifications: Array.isArray(rawContent.advancedCertifications)
      ? rawContent.advancedCertifications.filter(item => typeof item === 'string' && item.trim())
      : []
  };

  return {
    ...rawContent,
    ...normalizedKnownFields
  };
};

/**
 * Validates and normalizes the report data using assessment-specific validators.
 * Does not mutate the original API response.
 * 
 * @param {Object} rawReport The raw report object from the backend API.
 * @returns {Object} { isValid: boolean, errors: string[], normalized: Object|null }
 */
export const validateAndNormalizeReport = (rawReport) => {
  const errors = [];

  if (!rawReport || typeof rawReport !== 'object') {
    return { isValid: false, errors: ["Report is not a valid object"], normalized: null };
  }

  // 1. Resolve and Validate Assessment Type
  const resolvedType = resolveReportType(rawReport);
  if (!resolvedType) {
    errors.push("Invalid or unsupported assessment type.");
    return { isValid: false, errors, normalized: null };
  }

  // 2. Clone basic information safely
  const userName = typeof rawReport.userName === 'string' ? rawReport.userName.trim() : "";
  const email = typeof rawReport.email === 'string' ? rawReport.email.trim() : "";
  const timestamp = typeof rawReport.timestamp === 'string' ? rawReport.timestamp : new Date().toISOString();
  const isPremium = Boolean(rawReport.isPremium);

  if (!userName) {
    errors.push("User name is missing or invalid.");
  }

  // 3. Normalize Match Results
  const rawMatchResults = Array.isArray(rawReport.matchResults) ? rawReport.matchResults : [];
  const seenCareers = new Set();
  const normalizedMatchResults = [];

  rawMatchResults.forEach((res, index) => {
    if (!res || typeof res !== 'object') return;
    const name = typeof res.careerName === 'string' ? res.careerName.trim() : "";
    let pct = res.matchPercentage;

    if (!name) {
      errors.push(`Match result at index ${index} is missing a careerName.`);
      return;
    }

    if (!isFiniteNumber(pct) || pct < 0 || pct > 100) {
      console.warn(`[Validation] Match percentage for ${name} is invalid (${pct}). Fallback to 0.`);
      pct = 0;
    }

    if (seenCareers.has(name.toLowerCase())) {
      console.warn(`[Validation] Duplicate match recommendation removed: ${name}`);
      return;
    }

    seenCareers.add(name.toLowerCase());
    normalizedMatchResults.push({
      careerName: name,
      matchPercentage: pct
    });
  });

  // 4. Normalize User Traits
  const rawTraits = rawReport.userTraits && typeof rawReport.userTraits === 'object' ? rawReport.userTraits : {};
  const normalizedUserTraits = {};

  Object.entries(rawTraits).forEach(([trait, score]) => {
    let cleanScore = score;
    if (!isFiniteNumber(cleanScore) || cleanScore < 0 || cleanScore > 5) {
      console.warn(`[Validation] Trait "${trait}" score is invalid (${score}). Fallback to 0.`);
      cleanScore = 0;
    }
    normalizedUserTraits[trait] = cleanScore;
  });

  // 5. Assessment-Specific reportContent validation
  const rawContent = rawReport.reportContent && typeof rawReport.reportContent === 'object'
    ? rawReport.reportContent
    : {};

  let normalizedContent = {};

  switch (resolvedType) {
    case 'class_5_8':
      normalizedContent = validateClass58(rawContent);
      break;
    case 'class_9_10':
    case 'student_8_10':
      normalizedContent = validateClass910(rawContent);
      break;
    case 'class_11_12':
    case 'student_11_12':
      normalizedContent = validateClass1112(rawContent);
      break;
    case 'undergraduate':
      normalizedContent = validateUndergraduate(rawContent);
      break;
    case 'professional':
    default:
      normalizedContent = validateProfessional(rawContent);
      break;
  }

  const normalized = {
    uid: typeof rawReport.uid === 'string' ? rawReport.uid : "",
    userName,
    email,
    timestamp,
    matchResults: normalizedMatchResults,
    userTraits: normalizedUserTraits,
    reportContent: normalizedContent,
    assessmentType: resolvedType,
    isPremium
  };

  // Development verification logging
  console.log("RAW REPORT CONTENT:", rawReport.reportContent);
  console.log("NORMALIZED REPORT CONTENT:", normalized.reportContent);

  return {
    isValid: errors.length === 0,
    errors,
    normalized
  };
};
