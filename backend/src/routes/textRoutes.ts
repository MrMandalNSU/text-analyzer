import express from "express";
import {
  createText,
  getAllTexts,
  deleteText,
} from "../controllers/textController";

const router = express.Router();

router.post("/", createText);
router.get("/", getAllTexts);
router.delete("/:textId", deleteText);

export default router;
