import { Request, Response } from "express";
import { config } from "../config/env";

export class WebhookController {
  // Webhook Verification (GET /api/webhook)
  verifyWebhook = (req: Request, res: Response): void => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token) {
      if (mode === "subscribe" && token === config.whatsApp.verifyToken) {
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
  handleWebhook = (req: Request, res: Response): void => {
    const body = req.body;

    console.log("Incoming Webhook payload:", JSON.stringify(body, null, 2));

    // Respond to Meta that we received the event
    res.status(200).send("EVENT_RECEIVED");
  };
}
