import React from 'react';
import ReportCover from '../shared/ReportCover.jsx';
import Student1112FreeReport from './Student1112FreeReport.jsx';
import Student1112PremiumReport from './Student1112PremiumReport.jsx';
import './c1112Report.css';

/**
 * Student1112Report coordinates the layout switches for Class 11-12 report.
 * Renders Page 1 Cover and gates Premium / Free views cleanly.
 */
const Student1112Report = ({
  userName,
  timestamp,
  reportContent = {},
  userTraits = {},
  matchResults = [],
  topRecommendations = [],
  isPremiumUnlocked = false,
  hasPremium = false,
  handleUpgrade
}) => {
  const coverTitle = reportContent.reportTitle || "Career Planning Report";

  // Dynamic values parsed from schema
  const careerFields = reportContent.careerFields || [];
  const degrees = reportContent.degrees || [];
  const entranceExams = reportContent.entranceExams || [];
  const executiveSummary = reportContent.executiveSummary || "";

  // Normalize match items cleanly across schema variations
  const normalizedMatches = (matchResults && matchResults.length > 0)
    ? matchResults
    : (topRecommendations && topRecommendations.length > 0)
      ? topRecommendations.map((r, i) => ({
          careerName: r.careerName || r.career || r.field || `Career Option ${i + 1}`,
          matchPercentage: typeof r.matchPercentage === 'number' ? r.matchPercentage : Math.max(75, 92 - i * 5)
        }))
      : careerFields.map((f, i) => ({
          careerName: f.field || `Career Field ${i + 1}`,
          matchPercentage: Math.max(75, 92 - i * 5)
        }));

  return (
    <div className="report-inner-container flex flex-col gap-8 w-full">
      {/* Page 1: Premium Cover */}
      <ReportCover
        type="class_11_12"
        title={coverTitle}
        badge="Verified Report Portfolio"
        userName={userName}
        timestamp={timestamp}
        executiveSummary={executiveSummary}
      />

      {/* Gated views based on premium purchase status */}
      {isPremiumUnlocked ? (
        <Student1112PremiumReport
          reportContent={reportContent}
          userTraits={userTraits}
          matchResults={normalizedMatches}
        />
      ) : (
        <Student1112FreeReport
          executiveSummary={executiveSummary}
          careerFields={careerFields}
          degrees={degrees}
          entranceExams={entranceExams}
          matchResults={normalizedMatches}
          userTraits={userTraits}
          onUpgrade={handleUpgrade}
          hasPremium={hasPremium}
        />
      )}
    </div>
  );
};

export default Student1112Report;
export { Student1112Report };
