import Text from "../models/textModel";
import Analysis from "../models/analysisModel";
import { analyzeText } from "../utils/analyzer";

const getOrCreateAnalysis = async (textId: string) => {
  const textDoc = await Text.findById(textId);
  if (!textDoc) throw new Error("Text not found");

  // Triggers if analysis already exists
  if (textDoc.analysisId) {
    const existing = await Analysis.findById(textDoc.analysisId);
    if (existing) return existing;
  }

  // Analyze and store
  const result = analyzeText(textDoc.text);
  const analysis = await Analysis.create({
    textId,
    wordCount: result.wordCount,
    charCount: result.charCount,
    sentenceCount: result.sentenceCount,
    paragraphCount: result.paragraphCount,
    longestWords: result.longestWords,
  });

  textDoc.analysisId = analysis._id;
  await textDoc.save();

  return analysis;
};

// Words Counter
export const analyzeWordsService = async (textId: string) => {
  const analysis = await getOrCreateAnalysis(textId);
  return { wordCount: analysis.wordCount };
};

// Character Counter
export const analyzeCharsService = async (textId: string) => {
  const analysis = await getOrCreateAnalysis(textId);
  return { charCount: analysis.charCount };
};

// Sentences Counter
export const analyzeSentencesService = async (textId: string) => {
  const analysis = await getOrCreateAnalysis(textId);
  return { sentenceCount: analysis.sentenceCount };
};

// Paragraph Counter
export const analyzeParagraphsService = async (textId: string) => {
  const analysis = await getOrCreateAnalysis(textId);
  return { paragraphCount: analysis.paragraphCount };
};

// Longest Words in each Paragraph Finder
export const analyzeLongestWordsService = async (textId: string) => {
  const analysis = await getOrCreateAnalysis(textId);
  return { longestWords: analysis.longestWords };
};
