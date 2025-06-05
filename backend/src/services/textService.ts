import Text from "../models/textModel";

export const createTextService = async (userId: string, text: string) => {
  return await Text.create({ userId, text });
};

export const getAllTextsService = async () => {
  return await Text.find().populate("analysisId");
};
