"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const textController_1 = require("../controllers/textController");
const router = express_1.default.Router();
router.post("/", textController_1.createText);
router.get("/", textController_1.getAllTexts);
router.put("/:textId", textController_1.updateText);
router.get("/all", textController_1.getAllUsersTexts);
router.delete("/:textId", textController_1.deleteText);
router.get("/userCount", textController_1.getUserCount);
exports.default = router;
