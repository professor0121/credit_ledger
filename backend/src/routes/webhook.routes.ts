import { Router } from "express";
import { WebhookController } from "../controllers/WebhookController";

export function createWebhookRouter(webhookController: WebhookController): Router {
  const router = Router();
  router.get("/", webhookController.verifyWebhook);
  router.post("/", webhookController.handleWebhook);
  return router;
}
