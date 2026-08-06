/**
 * Automated Content Moderation Engine
 * Scans text content for toxic phrases, spam URL patterns, and inappropriate language.
 */

const TOXIC_TERMS = [
  'scam', 'phishing', 'free money', 'cryptocurrency giveaway',
  'hack account', 'exploit vulnerability', 'malware download',
  'spam_link', 'click here for prize'
];

/**
 * Filter text content for toxic or spam patterns.
 * Returns { isFlagged: boolean, reason?: string, cleanContent: string }
 */
const moderateContent = (text = '') => {
  if (!text || typeof text !== 'string') {
    return { isFlagged: false, cleanContent: text };
  }

  const lowerText = text.toLowerCase();
  
  for (const term of TOXIC_TERMS) {
    if (lowerText.includes(term)) {
      return {
        isFlagged: true,
        reason: `Content flagged for potential spam or inappropriate language: "${term}"`,
        cleanContent: text.replace(new RegExp(term, 'gi'), '***'),
      };
    }
  }

  // Check for suspicious URL repetition (spam detection)
  const urlMatches = text.match(/https?:\/\/[^\s]+/g);
  if (urlMatches && urlMatches.length > 5) {
    return {
      isFlagged: true,
      reason: 'Content flagged: Excessive URL links detected (Spam Filter)',
      cleanContent: text,
    };
  }

  return { isFlagged: false, cleanContent: text };
};

module.exports = {
  moderateContent,
  TOXIC_TERMS,
};
