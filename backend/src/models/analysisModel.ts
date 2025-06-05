import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    textId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Text",
      required: true,
    },
    wordCount: {
      type: Number,
      required: true,
    },
    charCount: {
      type: Number,
      required: true,
    },
    sentenceCount: {
      type: Number,
      required: true,
    },
    paragraphCount: {
      type: Number,
      required: true,
    },
    longestWords: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Analysis", analysisSchema);
