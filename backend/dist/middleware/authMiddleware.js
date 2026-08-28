"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    const token = header?.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "No token provided" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.config.jwtSecret);
        req.shopId = decoded.shopId;
        next();
    }
    catch {
        res.status(401).json({ error: "Invalid token" });
    }
}
