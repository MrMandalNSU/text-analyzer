import express from "express";
import { createText, getAllTexts } from "../controllers/textController";

const router = express.Router();

router.post("/", createText);
router.get("/", getAllTexts);

export default router;
