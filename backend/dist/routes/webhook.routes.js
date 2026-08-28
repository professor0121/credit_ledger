"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebhookRouter = createWebhookRouter;
const express_1 = require("express");
function createWebhookRouter(webhookController) {
    const router = (0, express_1.Router)();
    router.get("/", webhookController.verifyWebhook);
    router.post("/", webhookController.handleWebhook);
    return router;
}
