"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const textRoutes_1 = __importDefault(require("./routes/textRoutes"));
const analysisRoutes_1 = __importDefault(require("./routes/analysisRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const requiredEnv = (key) => {
    var _a;
    const value = (_a = process.env[key]) === null || _a === void 0 ? void 0 : _a.trim();
    if (!value) {
        throw new Error(`${key} is required.`);
    }
    return value;
};
const apiRoutePrefix = requiredEnv("API_ROUTE_PREFIX").replace(/\/$/, "");
const allowedCorsOrigins = requiredEnv("CORS_ORIGINS")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedCorsOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
};
// CORS
app.use((0, cors_1.default)(corsOptions));
// JSON body parser
app.use(express_1.default.json());
// Route registrations
app.use(`${apiRoutePrefix}/texts`, textRoutes_1.default);
app.use(`${apiRoutePrefix}/analysis`, analysisRoutes_1.default);
// DB connections
mongoose_1.default
    .connect(requiredEnv("MONGO_URI"))
    .then(() => console.log("✅ MongoDB Atlas connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
exports.default = app;
