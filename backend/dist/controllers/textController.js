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
exports.getUserCount = exports.deleteText = exports.updateText = exports.getAllUsersTexts = exports.getAllTexts = exports.createText = void 0;
const textService_1 = require("../services/textService");
require("../models/analysisModel");
const createText = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, text } = req.body;
        if (!userId || !text) {
            res.status(400).json({ message: "userId and text are required." });
            return;
        }
        const newText = yield (0, textService_1.createTextService)(userId, text);
        res.status(201).json(newText);
    }
    catch (err) {
        console.error("Error creating text:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createText = createText;
const getAllTexts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        const texts = yield (0, textService_1.getAllTextsService)(userId);
        res.json(texts);
    }
    catch (err) {
        console.error("Error fetching texts:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAllTexts = getAllTexts;
const getAllUsersTexts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const texts = yield (0, textService_1.getAllUsersTextsService)();
        res.json(texts);
    }
    catch (err) {
        console.error("Error fetching texts:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAllUsersTexts = getAllUsersTexts;
const updateText = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { textId } = req.params;
        const { text } = req.body;
        if (!text) {
            res.status(400).json({ message: "Text content is required." });
            return;
        }
        const updated = yield (0, textService_1.updateTextService)(textId, text);
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
exports.updateText = updateText;
const deleteText = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { textId } = req.params;
        const result = yield (0, textService_1.deleteTextService)(textId);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
exports.deleteText = deleteText;
const getUserCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userCount = yield (0, textService_1.getUserCountService)();
        res.json(userCount);
    }
    catch (err) {
        console.error("Error fetching user count:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getUserCount = getUserCount;
