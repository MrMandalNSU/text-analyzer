import { analyzeText } from "../utils/analyzer";

describe("Text Analyzer Utility", () => {
  const sampleText = "The quick brown fox jumps.\nThe lazy dog sleeps.";

  it("should count words", () => {
    const result = analyzeText(sampleText);
    expect(result.wordCount).toBe(9);
  });

  it("should count sentences", () => {
    const result = analyzeText(sampleText);
    expect(result.sentenceCount).toBe(2);
  });

  it("should find longest words in each paragraph", () => {
    const result = analyzeText(sampleText);
    expect(result.longestWords).toEqual(["quick", "sleeps"]);
  });
});
