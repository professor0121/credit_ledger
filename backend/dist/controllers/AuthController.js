"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const ApiError_1 = require("../utils/ApiError");
class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    sendOtp = async (req, res, next) => {
        try {
            const { phone } = req.body;
            if (!phone) {
                throw new ApiError_1.ApiError(400, "Phone number is required");
            }
            await this.authService.requestOtp(phone);
            res.json({ success: true, message: "OTP sent successfully" });
        }
        catch (err) {
            next(err);
        }
    };
    verifyOtp = async (req, res, next) => {
        try {
            const { phone, otp } = req.body;
            if (!phone || !otp) {
                throw new ApiError_1.ApiError(400, "Phone number and OTP are required");
            }
            const result = await this.authService.verifyOtp(phone, otp);
            res.json({ success: true, ...result });
        }
        catch (err) {
            next(err);
        }
    };
}
exports.AuthController = AuthController;
