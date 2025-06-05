import { Request, Response } from "express";
import {
  analyzeWordsService,
  analyzeCharsService,
  analyzeSentencesService,
  analyzeParagraphsService,
  analyzeLongestWordsService,
} from "../services/analysisService";

export const analyzeWords = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { textId } = req.params;
    const result = await analyzeWordsService(textId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const analyzeChars = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { textId } = req.params;
    const result = await analyzeCharsService(textId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const analyzeSentences = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { textId } = req.params;
    const result = await analyzeSentencesService(textId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const analyzeParagraphs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { textId } = req.params;
    const result = await analyzeParagraphsService(textId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const analyzeLongestWords = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { textId } = req.params;
    const result = await analyzeLongestWordsService(textId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
