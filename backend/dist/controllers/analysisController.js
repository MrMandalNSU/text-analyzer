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
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeLongestWords = exports.analyzeParagraphs = exports.analyzeSentences = exports.analyzeChars = exports.analyzeWords = void 0;
const analysisService_1 = require("../services/analysisService");
const analyzeWords = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { textId } = req.params;
        const result = yield (0, analysisService_1.analyzeWordsService)(textId);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
exports.analyzeWords = analyzeWords;
const analyzeChars = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { textId } = req.params;
        const result = yield (0, analysisService_1.analyzeCharsService)(textId);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
exports.analyzeChars = analyzeChars;
const analyzeSentences = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { textId } = req.params;
        const result = yield (0, analysisService_1.analyzeSentencesService)(textId);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
exports.analyzeSentences = analyzeSentences;
const analyzeParagraphs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { textId } = req.params;
        const result = yield (0, analysisService_1.analyzeParagraphsService)(textId);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
exports.analyzeParagraphs = analyzeParagraphs;
const analyzeLongestWords = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { textId } = req.params;
        const result = yield (0, analysisService_1.analyzeLongestWordsService)(textId);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
exports.analyzeLongestWords = analyzeLongestWords;
