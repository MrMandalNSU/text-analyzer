import express from "express";
import {
  createText,
  getAllTexts,
  getAllUsersTexts,
  deleteText,
} from "../controllers/textController";

const router = express.Router();

router.post("/", createText);
router.get("/", getAllTexts);
router.get("/all", getAllUsersTexts);
router.delete("/:textId", deleteText);

export default router;
