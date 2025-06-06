import mongoose, { Document, Types } from "mongoose";

export interface IText extends Document {
  userId: string;
  text: string;
  analysisId: Types.ObjectId | null;
}

const textSchema = new mongoose.Schema<IText>(
  {
    userId: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    analysisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Analysis",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IText>("Text", textSchema);
