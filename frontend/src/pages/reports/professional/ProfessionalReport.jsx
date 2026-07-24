import React from 'react';
import ReportCover from '../shared/ReportCover.jsx';
import ProfessionalFreeReport from './ProfessionalFreeReport.jsx';
import ProfessionalPremiumReport from './ProfessionalPremiumReport.jsx';

/**
 * ProfessionalReport coordintates the layout switches for Professional assessment.
 * Renders the Executive Career Report.
 */
const ProfessionalReport = ({
  userName,
  timestamp,
  reportContent = {},
  isPremiumUnlocked = false,
  hasPremium = false,
  handleUpgrade
}) => {
  const coverTitle = reportContent.reportTitle || "Executive Career Report";

  // Dynamic values parsed from schema
  const leadership = reportContent.leadership || {};
  const careerTransition = reportContent.careerTransition || [];

  return (
    <div className="report-inner-container flex flex-col gap-8 w-full">
      {/* Page 1: Premium Cover */}
      <ReportCover
        type="professional"
        title={coverTitle}
        badge="Executive Report"
        userName={userName}
        timestamp={timestamp}
        executiveSummary={reportContent.executiveSummary}
      />

      {/* Gated views based on premium purchase status */}
      {isPremiumUnlocked ? (
        <ProfessionalPremiumReport
          reportContent={reportContent}
        />
      ) : (
        <ProfessionalFreeReport
          leadership={leadership}
          careerTransition={careerTransition}
          onUpgrade={handleUpgrade}
          hasPremium={hasPremium}
        />
      )}
    </div>
  );
};

export default ProfessionalReport;
