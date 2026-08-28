"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppService = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
class WhatsAppService {
    baseUrl;
    token;
    isMock;
    constructor() {
        this.baseUrl = `https://graph.facebook.com/v20.0/${env_1.config.whatsApp.phoneNumberId}/messages`;
        this.token = env_1.config.whatsApp.accessToken;
        this.isMock = env_1.config.whatsApp.isMock;
    }
    async send(payload) {
        if (this.isMock) {
            console.log("[MOCK WHATSAPP] Sending message payload:", JSON.stringify(payload, null, 2));
            return;
        }
        try {
            await axios_1.default.post(this.baseUrl, payload, {
                headers: { Authorization: `Bearer ${this.token}` },
            });
        }
        catch (err) {
            console.error("WhatsApp send failed:", err?.response?.data || err.message);
        }
    }
    async sendOtp(phone, params) {
        await this.send({
            messaging_product: "whatsapp",
            to: phone,
            type: "template",
            template: {
                name: "templage_na",
                language: { code: "en" },
                components: [{ type: "body", parameters: [{ type: "text", text: params.otp }] }],
            },
        });
    }
    async sendUdhaarNotification(phone, params) {
        await this.send({
            messaging_product: "whatsapp",
            to: phone,
            type: "template",
            template: {
                name: "udhaar_notification",
                language: { code: "en" },
                components: [
                    {
                        type: "body",
                        parameters: [
                            { type: "text", text: params.shopName },
                            { type: "text", text: params.amount },
                            { type: "text", text: params.balance },
                        ],
                    },
                ],
            },
        });
    }
}
exports.WhatsAppService = WhatsAppService;
