import { Request, Response } from "express";
import {
  createTextService,
  getAllTextsService,
  getAllUsersTextsService,
  deleteTextService,
} from "../services/textService";
import "../models/analysisModel";

export const createText = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, text } = req.body;

    if (!userId || !text) {
      res.status(400).json({ message: "userId and text are required." });
      return;
    }

    const newText = await createTextService(userId, text);
    res.status(201).json(newText);
  } catch (err) {
    console.error("Error creating text:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllTexts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.query;
    const texts = await getAllTextsService(userId as string);
    res.json(texts);
  } catch (err) {
    console.error("Error fetching texts:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUsersTexts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const texts = await getAllUsersTextsService();
    res.json(texts);
  } catch (err) {
    console.error("Error fetching texts:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteText = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { textId } = req.params;
    const result = await deleteTextService(textId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
