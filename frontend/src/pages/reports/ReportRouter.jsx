import React from 'react';
import Class58Report from './student-8-10/Class58Report.jsx';
import Class910Report from './student-8-10/Class910Report.jsx';
import Student1112Report from './student-11-12/Student1112Report.jsx';
import UndergraduateReport from './undergraduate/UndergraduateReport.jsx';
import ProfessionalReport from './professional/ProfessionalReport.jsx';
import ReportUnavailable from './shared/ReportUnavailable.jsx';

/**
 * ReportRouter switches between layouts based on explicit verified assessmentType.
 * Does NOT guess or infer the type.
 */
const ReportRouter = ({
  report,
  isPremiumUnlocked,
  hasPremium,
  handleUpgrade
}) => {
  const type = report.assessmentType;
  console.log(
    "REPORT JSON:",
    JSON.stringify(report, null, 2)
  );
  const topRecommendations =
    report.reportContent?.careerRecommendations ||
    report.reportContent?.careerFields ||
    report.reportContent?.careerPaths ||
    report.matchResults ||
    [];

  const commonProps = {
    userName: report.userName,
    timestamp: report.timestamp,
    reportContent: report.reportContent,
    userTraits: report.userTraits,
    topRecommendations,
    matchResults: report.matchResults || [],
    isPremiumUnlocked,
    hasPremium,
    handleUpgrade
  };

  switch (type) {
    case 'class_5_8':
      return <Class58Report {...commonProps} />;
    case 'class_9_10':
    case 'student_8_10':
      return <Class910Report {...commonProps} />;
    case 'class_11_12':
    case 'student_11_12':
      return <Student1112Report {...commonProps} />;
    case 'undergraduate':
      return <UndergraduateReport {...commonProps} />;
    case 'professional':
      return <ProfessionalReport {...commonProps} />;
    default:
      return (
        <ReportUnavailable
          message={`Unsupported or unrecognized assessment type "${type}".`}
        />
      );
  }
};

export default ReportRouter;