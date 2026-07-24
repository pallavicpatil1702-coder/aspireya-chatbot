import React from 'react';
import ReportPage from './reports/ReportPage.jsx';

/**
 * Report is a lightweight page wrapper that forwards rendering to ReportPage.
 * This maintains backward compatibility with App.jsx and other route imports.
 */
const Report = ({ isPremiumRoute = false }) => {
  return <ReportPage isPremiumRoute={isPremiumRoute} />;
};

export default Report;
export { Report };
