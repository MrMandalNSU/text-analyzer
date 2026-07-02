"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeLongestWordsService = exports.analyzeParagraphsService = exports.analyzeSentencesService = exports.analyzeCharsService = exports.analyzeWordsService = void 0;
const textModel_1 = __importDefault(require("../models/textModel"));
const analysisModel_1 = __importDefault(require("../models/analysisModel"));
const analyzer_1 = require("../utils/analyzer");
const getOrCreateAnalysis = (textId) => __awaiter(void 0, void 0, void 0, function* () {
    const textDoc = yield textModel_1.default.findById(textId);
    if (!textDoc)
        throw new Error("Text not found");
    // Triggers if analysis already exists
    if (textDoc.analysisId) {
        const existing = yield analysisModel_1.default.findById(textDoc.analysisId);
        if (existing)
            return existing;
    }
    // Analyze and store
    const result = (0, analyzer_1.analyzeText)(textDoc.text);
    const analysis = yield analysisModel_1.default.create({
        textId,
        wordCount: result.wordCount,
        charCount: result.charCount,
        sentenceCount: result.sentenceCount,
        paragraphCount: result.paragraphCount,
        longestWords: result.longestWords,
    });
    textDoc.analysisId = analysis._id;
    yield textDoc.save();
    return analysis;
});
// Words Counter
const analyzeWordsService = (textId) => __awaiter(void 0, void 0, void 0, function* () {
    const analysis = yield getOrCreateAnalysis(textId);
    return { wordCount: analysis.wordCount };
});
exports.analyzeWordsService = analyzeWordsService;
// Character Counter
const analyzeCharsService = (textId) => __awaiter(void 0, void 0, void 0, function* () {
    const analysis = yield getOrCreateAnalysis(textId);
    return { charCount: analysis.charCount };
});
exports.analyzeCharsService = analyzeCharsService;
// Sentences Counter
const analyzeSentencesService = (textId) => __awaiter(void 0, void 0, void 0, function* () {
    const analysis = yield getOrCreateAnalysis(textId);
    return { sentenceCount: analysis.sentenceCount };
});
exports.analyzeSentencesService = analyzeSentencesService;
// Paragraph Counter
const analyzeParagraphsService = (textId) => __awaiter(void 0, void 0, void 0, function* () {
    const analysis = yield getOrCreateAnalysis(textId);
    return { paragraphCount: analysis.paragraphCount };
});
exports.analyzeParagraphsService = analyzeParagraphsService;
// Longest Words in each Paragraph Finder
const analyzeLongestWordsService = (textId) => __awaiter(void 0, void 0, void 0, function* () {
    const analysis = yield getOrCreateAnalysis(textId);
    return { longestWords: analysis.longestWords };
});
exports.analyzeLongestWordsService = analyzeLongestWordsService;
