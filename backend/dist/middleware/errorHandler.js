"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const ApiError_1 = require("../utils/ApiError");
function errorHandler(err, _req, res, _next) {
    if (err instanceof ApiError_1.ApiError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
    }
    console.error("Unhandled Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
}
