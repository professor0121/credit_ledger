"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, "../../.env") });
exports.config = {
    port: parseInt(process.env.PORT || "5000", 10),
    mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/credit_ledger",
    jwtSecret: process.env.JWT_SECRET || "dev_jwt_secret_key_change_me_in_production",
    whatsApp: {
        phoneNumberId: process.env.WA_PHONE_NUMBER_ID || "",
        businessAccountId: process.env.WA_BUSINESS_ACCOUNT_ID || "",
        accessToken: process.env.WA_ACCESS_TOKEN || "",
        verifyToken: process.env.WA_VERIFY_TOKEN || "dev_verify_token",
        isMock: !process.env.WA_PHONE_NUMBER_ID || process.env.WA_PHONE_NUMBER_ID.includes("mock"),
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
        apiKey: process.env.CLOUDINARY_API_KEY || "",
        apiSecret: process.env.CLOUDINARY_API_SECRET || "",
        isMock: !process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME.includes("mock"),
    },
};
