"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const analysisSchema = new mongoose_1.default.Schema({
    textId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, { timestamps: true });
exports.default = mongoose_1.default.model("Analysis", analysisSchema);
