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
exports.getUserCountService = exports.deleteTextService = exports.updateTextService = exports.getAllUsersTextsService = exports.getAllTextsService = exports.createTextService = void 0;
const textModel_1 = __importDefault(require("../models/textModel"));
const analysisModel_1 = __importDefault(require("../models/analysisModel"));
const createTextService = (userId, text) => __awaiter(void 0, void 0, void 0, function* () {
    return yield textModel_1.default.create({ userId, text });
});
exports.createTextService = createTextService;
const getAllTextsService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield textModel_1.default.find({ userId }).populate("analysisId");
});
exports.getAllTextsService = getAllTextsService;
const getAllUsersTextsService = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield textModel_1.default.find().populate("analysisId");
});
exports.getAllUsersTextsService = getAllUsersTextsService;
const updateTextService = (textId, newText) => __awaiter(void 0, void 0, void 0, function* () {
    const textDoc = yield textModel_1.default.findById(textId);
    if (!textDoc)
        throw new Error("Text not found");
    textDoc.text = newText;
    textDoc.analysisId = null; // Reset analysis since content changed
    yield textDoc.save();
    return textDoc;
});
exports.updateTextService = updateTextService;
const deleteTextService = (textId) => __awaiter(void 0, void 0, void 0, function* () {
    const text = yield textModel_1.default.findById(textId);
    if (!text)
        throw new Error("Text not found");
    // Delete associated analysis if exists
    if (text.analysisId) {
        yield analysisModel_1.default.findByIdAndDelete(text.analysisId);
    }
    // Delete the text itself
    yield textModel_1.default.findByIdAndDelete(textId);
    return { message: "Text and its analysis (if any) deleted successfully." };
});
exports.deleteTextService = deleteTextService;
const getUserCountService = () => __awaiter(void 0, void 0, void 0, function* () {
    const uniqueUsers = yield textModel_1.default.distinct("userId");
    return {
        count: uniqueUsers.length,
    };
});
exports.getUserCountService = getUserCountService;
