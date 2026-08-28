"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Otp_model_1 = require("../models/Otp.model");
const Shop_model_1 = require("../models/Shop.model");
const env_1 = require("../config/env");
class AuthService {
    whatsAppService;
    constructor(whatsAppService) {
        this.whatsAppService = whatsAppService;
    }
    generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async requestOtp(phone) {
        const otp = this.generateOtp();
        await Otp_model_1.OtpModel.deleteMany({ phone });
        await Otp_model_1.OtpModel.create({
            phone,
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        });
        await this.whatsAppService.sendOtp(phone, { otp });
    }
    async verifyOtp(phone, otp) {
        const record = await Otp_model_1.OtpModel.findOne({ phone, otp });
        if (!record)
            throw new Error("Invalid or expired OTP");
        await Otp_model_1.OtpModel.deleteMany({ phone });
        let shop = await Shop_model_1.ShopModel.findOne({ whatsappNumber: phone });
        if (!shop) {
            shop = await Shop_model_1.ShopModel.create({ whatsappNumber: phone, ownerName: "New Owner", shopName: "New Shop" });
        }
        const token = jsonwebtoken_1.default.sign({ shopId: shop._id }, env_1.config.jwtSecret, {
            expiresIn: "30d",
        });
        return { token, shop };
    }
}
exports.AuthService = AuthService;
