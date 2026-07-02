"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const analysisController_1 = require("../controllers/analysisController");
const router = express_1.default.Router();
router.post("/:textId/words", analysisController_1.analyzeWords);
router.post("/:textId/characters", analysisController_1.analyzeChars);
router.post("/:textId/sentences", analysisController_1.analyzeSentences);
router.post("/:textId/paragraphs", analysisController_1.analyzeParagraphs);
router.post("/:textId/longest-words", analysisController_1.analyzeLongestWords);
exports.default = router;
