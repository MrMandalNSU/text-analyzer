export function analyzeText(content: string) {
  const paragraphs = content.split(/\n+/).filter(Boolean);
  const sentences = content.split(/[.!?]\s*/).filter(Boolean);
  const words = content.toLowerCase().match(/\b\w+\b/g) || [];
  const chars = content.replace(/\s+/g, "").length;

  // Longest word in each paragraph
  const longestWords = paragraphs.map((p) => {
    const words = p.toLowerCase().match(/\b\w+\b/g) || [];
    return words.reduce((a, b) => (b.length > a.length ? b : a), "");
  });

  return {
    wordCount: words.length,
    charCount: chars,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
    longestWords,
  };
}
