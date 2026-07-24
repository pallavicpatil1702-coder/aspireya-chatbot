/**
 * Utility functions to parse, transform and format raw AI generated text.
 * Strictly enforces that no text block contains more than 60 words without a visual break.
 */

/**
 * Splits a paragraph or continuous string of AI content into structured bullet points.
 * Ensures each bullet point is short (under 25 words).
 * 
 * @param {string} text Raw AI text
 * @param {number} maxItems Max bullets to return
 * @returns {string[]} Array of formatted bullet strings
 */
export const bulletizeAIText = (text, maxItems = 4) => {
  if (!text || typeof text !== 'string') {
    return ["Information unavailable"];
  }

  // Split by sentence boundaries or newlines
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 8 && !s.toLowerCase().includes("based on"));

  if (sentences.length === 0) {
    return ["Information unavailable"];
  }

  return sentences.slice(0, maxItems).map(sentence => {
    // Limit words per bullet point
    const words = sentence.split(/\s+/);
    if (words.length > 20) {
      return words.slice(0, 18).join(" ") + "...";
    }
    return sentence;
  });
};

/**
 * Parses recommendations into DO and DON'T categories for guides (Parent/Teacher).
 * Catches negative indicator terms to place in the DON'T list.
 * 
 * @param {string|string[]} input Raw AI advice or array of suggestions
 * @returns {{dos: string[], donts: string[]}} Object with DO and DON'T bullet points
 */
export const categorizeAdvice = (input) => {
  const dos = [];
  const donts = [];

  const items = Array.isArray(input)
    ? input
    : typeof input === 'string'
      ? input.split(/(?<=[.!?])\s+|\n+/).map(s => s.trim()).filter(Boolean)
      : [];

  const dontKeywords = [
    "avoid", "dont", "don't", "refrain", "never", "limit", "restrict",
    "stop", "pressure", "force", "impose", "compare", "ignore"
  ];

  items.forEach(item => {
    const cleanItem = item.trim().replace(/^-\s*/, "");
    if (cleanItem.length < 10) return;

    // Categorize
    const lower = cleanItem.toLowerCase();
    const isDont = dontKeywords.some(keyword => lower.includes(keyword));

    if (isDont) {
      donts.push(cleanItem);
    } else {
      dos.push(cleanItem);
    }
  });

  // Fallbacks if one category is empty
  if (dos.length === 0) {
    dos.push("Encourage open-ended career exploration and self-paced learning projects.");
    dos.push("Provide resources for building analytical thinking and logic conceptualizations.");
  }
  if (donts.length === 0) {
    donts.push("Avoid placing high emotional stress regarding immediate score outputs.");
    donts.push("Do not limit exploration to only traditional high-demand corporate paths.");
  }

  return {
    dos: dos.slice(0, 3),
    donts: donts.slice(0, 3)
  };
};

/**
 * Limits any continuous block of text to a maximum of 50 words to prevent cognitive load.
 * 
 * @param {string} text Raw string
 * @param {number} wordLimit Maximum continuous words
 * @returns {string} Truncated string
 */
export const limitTextToSnippet = (text, wordLimit = 50) => {
  if (!text || typeof text !== 'string') return "Information unavailable";
  const words = text.trim().split(/\s+/);
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "...";
};

/**
 * Extracts a very brief tag/badge (2-4 words) from a text summary.
 */
export const extractBriefBadge = (text, defaultVal) => {
  if (!text || typeof text !== 'string') return defaultVal;
  
  // Strip common intros
  let clean = text.replace(/^(based on your answers, you|it appears that you|based on the assessment, you are|you are|your profile shows a strength in)\s+/i, "");
  
  // Get first sentence
  const sentence = clean.split(/[.!?]/)[0] || "";
  const words = sentence.split(/\s+/).filter(Boolean);
  
  if (words.length > 4) {
    return words.slice(0, 3).join(" ");
  }
  return sentence.trim() || defaultVal;
};
