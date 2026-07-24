import React from 'react';
import ReportCover from '../shared/ReportCover.jsx';
import HeroDashboard from '../shared/HeroDashboard.jsx';
import Student810FreeReport from './Student810FreeReport.jsx';
import Student810PremiumReport from './Student810PremiumReport.jsx';
import { sanitizeForStudent8 } from '../utils/textSanitizer.js';
import { getCoverDetails } from '../utils/reportDataAdapter.js';
import { extractBriefBadge } from '../utils/textParser.js';

/**
 * Student810Report is the coordinator for the Class 8-10 report.
 * Integrates Page 1 Cover, Page 2 Hero Dashboard, and Gates Premium views.
 */
const Student810Report = ({
  userName,
  timestamp,
  reportContent = {},
  topRecommendations = [],
  userTraits = {},
  isPremiumUnlocked = false,
  hasPremium = false,
  handleUpgrade
}) => {
  const cover = getCoverDetails('student_8_10');
  const sanitizedSummary = sanitizeForStudent8(reportContent.executiveSummary || "");

  // Dashboard calculations
  const primaryRec = topRecommendations[0] || {};
  const overallScore = primaryRec.matchPercentage || 85;
  const topCareer = primaryRec.career || "Science / Technical Track";

  const personalityType = extractBriefBadge(reportContent.sectionAnalysis?.personality, "Inquisitive & Methodical");
  const learningStyle = extractBriefBadge(reportContent.sectionAnalysis?.learningStyle, "Structured & Conceptual");
  const interestType = extractBriefBadge(reportContent.sectionAnalysis?.interests, "STEM Oriented");

  return (
    <div className="report-inner-container flex flex-col gap-8 w-full">
      {/* Page 1: Premium Cover */}
      <ReportCover
        type="student_8_10"
        title={cover.title}
        badge={cover.badge}
        userName={userName}
        timestamp={timestamp}
        executiveSummary={sanitizedSummary}
      />

      {/* Page 2: Hero Dashboard (surfaced immediately after Cover) */}
      <HeroDashboard
        overallScore={overallScore}
        topCareer={topCareer}
        personalityType={personalityType}
        learningStyle={learningStyle}
        interestType={interestType}
        confidenceLevel={90}
      />

      {/* Gated views based on premium purchase status */}
      {isPremiumUnlocked ? (
        <Student810PremiumReport
          reportContent={reportContent}
          topRecommendations={topRecommendations}
          userTraits={userTraits}
        />
      ) : (
        <Student810FreeReport
          topRecommendations={topRecommendations}
          userTraits={userTraits}
          onUpgrade={handleUpgrade}
          hasPremium={hasPremium}
        />
      )}
    </div>
  );
};

export default Student810Report;
