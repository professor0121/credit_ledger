"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookController = void 0;
const env_1 = require("../config/env");
class WebhookController {
    // Webhook Verification (GET /api/webhook)
    verifyWebhook = (req, res) => {
        const mode = req.query["hub.mode"];
        const token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];
        if (mode && token) {
            if (mode === "subscribe" && token === env_1.config.whatsApp.verifyToken) {
                console.log("WEBHOOK_VERIFIED");
                res.status(200).send(challenge);
                return;
            }
            res.sendStatus(403);
            return;
        }
        res.sendStatus(400);
    };
    // Webhook Event Handler (POST /api/webhook)
    handleWebhook = (req, res) => {
        const body = req.body;
        console.log("Incoming Webhook payload:", JSON.stringify(body, null, 2));
        // Respond to Meta that we received the event
        res.status(200).send("EVENT_RECEIVED");
    };
}
exports.WebhookController = WebhookController;
