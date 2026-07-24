import React from 'react';
import ReportCover from '../shared/ReportCover.jsx';
import UndergraduateFreeReport from './UndergraduateFreeReport.jsx';
import UndergraduatePremiumReport from './UndergraduatePremiumReport.jsx';

/**
 * UndergraduateReport coordinates the layout switches for Undergraduate assessment.
 * Renders the Work Preparation & Career Report.
 */
const UndergraduateReport = ({
  userName,
  timestamp,
  reportContent = {},
  topRecommendations = [],
  isPremiumUnlocked = false,
  hasPremium = false,
  handleUpgrade
}) => {
  const coverTitle = reportContent.reportTitle || "Work Preparation & Career Report";

  // Dynamic values or fallbacks matching our Undergraduate schema
  const careerPaths = reportContent.careerPaths || [];
  const internships = reportContent.internships || [];
  const certifications = reportContent.certifications || [];

  return (
    <div className="report-inner-container flex flex-col gap-8 w-full">
      {/* Page 1: Premium Cover */}
      <ReportCover
        type="undergraduate"
        title={coverTitle}
        badge="Career Report"
        userName={userName}
        timestamp={timestamp}
        executiveSummary={reportContent.executiveSummary}
      />

      {/* Gated views based on premium purchase status */}
      {isPremiumUnlocked ? (
        <UndergraduatePremiumReport
          reportContent={reportContent}
        />
      ) : (
        <UndergraduateFreeReport
          careerPaths={careerPaths}
          internships={internships}
          certifications={certifications}
          onUpgrade={handleUpgrade}
          hasPremium={hasPremium}
        />
      )}
    </div>
  );
};

export default UndergraduateReport;
