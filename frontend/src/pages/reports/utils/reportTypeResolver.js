const SUPPORTED_TYPES = new Set([
  'class_5_8',
  'class_9_10',
  'class_11_12',
  'student_8_10',
  'student_11_12',
  'undergraduate',
  'professional'
]);

/**
 * Resolves the assessment type from the report object.
 * Strictly avoids guessing or inferring from other data.
 * 
 * @param {Object} report The report data object.
 * @returns {string|null} Resolved supported assessment type or null if missing/invalid.
 */
export const resolveReportType = (report) => {
  if (!report) {
    console.warn("[Report Type Resolver] No report data provided.");
    return null;
  }

  const type = report.assessmentType;
  if (!type) {
    console.warn("[Report Type Resolver] assessmentType is missing.");
    return null;
  }

  if (SUPPORTED_TYPES.has(type)) {
    return type;
  }

  console.warn(`[Report Type Resolver] Unsupported assessmentType encountered: "${type}"`);
  return null;
};
