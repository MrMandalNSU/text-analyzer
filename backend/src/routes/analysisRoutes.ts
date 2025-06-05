import express from "express";
import {
  analyzeWords,
  analyzeChars,
  analyzeSentences,
  analyzeParagraphs,
  analyzeLongestWords,
} from "../controllers/analysisController";

const router = express.Router();

router.post("/:textId/words", analyzeWords);
router.post("/:textId/characters", analyzeChars);
router.post("/:textId/sentences", analyzeSentences);
router.post("/:textId/paragraphs", analyzeParagraphs);
router.post("/:textId/longest-words", analyzeLongestWords);

export default router;
