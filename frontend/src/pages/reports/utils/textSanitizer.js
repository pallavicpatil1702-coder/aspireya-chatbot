/**
 * Sanitizes text content for Class 8-10 reports by replacing professional/corporate
 * jargon with child-and-parent friendly academic terms.
 * 
 * @param {string} text The raw input text string to sanitize.
 * @returns {string} The sanitized text.
 */
export const sanitizeForStudent8 = (text) => {
  if (!text || typeof text !== 'string') return "";
  return text
    .replace(/salary|pay|compensation|income|earnings|stipend/gi, "learning reward")
    .replace(/corporate|corporate jobs|office jobs|industries/gi, "career paths")
    .replace(/promotion|climbing the ladder/gi, "academic growth")
    .replace(/leadership|management/gi, "collaboration")
    .replace(/resume|cv/gi, "school portfolio")
    .replace(/linkedin/gi, "school groups")
    .replace(/professional experience|work experience/gi, "project experience");
};
