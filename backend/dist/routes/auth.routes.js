"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthRouter = createAuthRouter;
const express_1 = require("express");
function createAuthRouter(authController) {
    const router = (0, express_1.Router)();
    router.post("/send-otp", authController.sendOtp);
    router.post("/verify-otp", authController.verifyOtp);
    return router;
}
