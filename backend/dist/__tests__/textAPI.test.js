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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const textModel_1 = __importDefault(require("../models/textModel"));
let createdTextId = "";
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(process.env.MONGO_URI);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield textModel_1.default.deleteMany({});
    yield mongoose_1.default.connection.close();
}));
describe("Text API Integration Tests", () => {
    it("should create a new text", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).post("/api/texts").send({
            userId: "test_user",
            text: "Hello world. This is a test.",
        });
        expect(res.status).toBe(201);
        expect(res.body.text).toBe("Hello world. This is a test.");
        expect(res.body.userId).toBe("test_user");
        createdTextId = res.body._id;
    }));
    it("should fetch all texts", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/texts/all");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    }));
    it("should update the text", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .put(`/api/texts/${createdTextId}`)
            .send({ text: "This is the updated text." });
        expect(res.status).toBe(200);
        expect(res.body.text).toBe("This is the updated text.");
    }));
    it("should delete the text", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).delete(`/api/texts/${createdTextId}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toMatch(/deleted/i);
    }));
});
