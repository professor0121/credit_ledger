"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
let isConnected = false;
async function connectDatabase() {
    if (isConnected) {
        return;
    }
    if (mongoose_1.default.connection.readyState >= 1) {
        isConnected = true;
        return;
    }
    try {
        await mongoose_1.default.connect(env_1.config.mongoUri);
        isConnected = true;
        console.log("Connected to MongoDB successfully");
    }
    catch (error) {
        console.error("MongoDB connection failed:", error);
        throw error;
    }
}
