import Text from "../models/textModel";
import Analysis from "../models/analysisModel";

export const createTextService = async (userId: string, text: string) => {
  return await Text.create({ userId, text });
};

export const getAllTextsService = async (userId: string) => {
  return await Text.find({ userId }).populate("analysisId");
};

export const getAllUsersTextsService = async () => {
  return await Text.find().populate("analysisId");
};

export const updateTextService = async (textId: string, newText: string) => {
  const textDoc = await Text.findById(textId);
  if (!textDoc) throw new Error("Text not found");

  textDoc.text = newText;
  textDoc.analysisId = null; // Reset analysis since content changed
  await textDoc.save();

  return textDoc;
};

export const deleteTextService = async (textId: string) => {
  const text = await Text.findById(textId);
  if (!text) throw new Error("Text not found");

  // Delete associated analysis if exists
  if (text.analysisId) {
    await Analysis.findByIdAndDelete(text.analysisId);
  }

  // Delete the text itself
  await Text.findByIdAndDelete(textId);
  return { message: "Text and its analysis (if any) deleted successfully." };
};
