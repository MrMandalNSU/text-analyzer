import { Request, Response } from "express";
import Text from "../models/textModel";
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

    const newText = await Text.create({ userId, text });
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
    const texts = await Text.find().populate("analysisId");
    res.json(texts);
  } catch (err) {
    console.error("Error fetching texts:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
