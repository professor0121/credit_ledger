import { Request, Response } from "express";
import { config } from "../config/env";
import { WhatsAppService } from "../services/WhatsAppService";
import { CustomerModel } from "../models/Customer.model";
import { IShop } from "../models/Shop.model";

export class WebhookController {
  constructor(private readonly whatsAppService?: WhatsAppService) {}

  // Webhook Verification (GET /api/webhook)
  verifyWebhook = (req: Request, res: Response): void => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token) {
      if (mode === "subscribe" && token === config.whatsApp.verifyToken) {
        console.log("[WEBHOOK] Verified successfully with Meta challenge.");
        res.status(200).send(challenge);
        return;
      }
      console.warn("[WEBHOOK] Verification failed: Token mismatch.");
      res.sendStatus(403);
      return;
    }
    res.sendStatus(400);
  };

  // Webhook Event Handler (POST /api/webhook)
  handleWebhook = async (req: Request, res: Response): Promise<void> => {
    const body = req.body;

    // Immediately acknowledge event to Meta
    res.status(200).send("EVENT_RECEIVED");

    if (body.object !== "whatsapp_business_account") {
      return;
    }

    try {
      const entries = body.entry || [];

      for (const entry of entries) {
        const changes = entry.changes || [];

        for (const change of changes) {
          const value = change.value;
          if (!value) continue;

          // 1. Handle Delivery/Read Status Updates
          if (value.statuses && value.statuses.length > 0) {
            for (const status of value.statuses) {
              console.log(
                `[WHATSAPP STATUS] Msg ID: ${status.id} | Status: ${status.status.toUpperCase()} | Recipient: ${status.recipient_id}`
              );
              if (status.errors) {
                console.error(`[WHATSAPP STATUS ERROR]`, JSON.stringify(status.errors, null, 2));
              }
            }
          }

          // 2. Handle Incoming Messages from Customers
          if (value.messages && value.messages.length > 0) {
            const contact = value.contacts?.[0];
            const senderName = contact?.profile?.name || "Customer";

            for (const msg of value.messages) {
              const sender = msg.from; // e.g. "916269880874"
              const msgType = msg.type;
              const textBody = msg.text?.body?.trim() || "";

              console.log(`\n📩 [INCOMING WHATSAPP MESSAGE]`);
              console.log(`From:    ${senderName} (+${sender})`);
              console.log(`Type:    ${msgType}`);
              console.log(`Message: "${textBody}"`);
              console.log(`Time:    ${new Date(parseInt(msg.timestamp, 10) * 1000).toLocaleString()}`);

              // Handle only text messages for auto-reply
              if (msgType === "text" && this.whatsAppService) {
                await this.processIncomingText(sender, senderName, textBody);
              }
            }
          }
        }
      }
    } catch (err: any) {
      console.error("[WEBHOOK PROCESSING ERROR]:", err.message || err);
    }
  };

  /**
   * Process customer incoming text and send smart auto-reply
   */
  private async processIncomingText(sender: string, senderName: string, text: string): Promise<void> {
    try {
      // Normalize sender phone to last 10 digits for database search
      const normalizedPhone = sender.replace(/\D/g, "").slice(-10);
      const lowerText = text.toLowerCase();

      // Find customer in MongoDB ledger
      const customer = await CustomerModel.findOne({
        phone: new RegExp(normalizedPhone + "$"),
      }).populate<{ shopId: IShop }>("shopId");

      let reply = "";
      const shopName = customer?.shopId?.shopName || "Dukaan";

      if (customer) {
        const balance = customer.currentBalance;
        const balanceFormatted = `₹${Math.abs(balance)}`;
        const balanceStatus =
          balance > 0
            ? `aapka kul baaki udhaar: ${balanceFormatted}`
            : balance < 0
            ? `aapka advance jama: ${balanceFormatted}`
            : `aapka hisab poora clear (₹0) hai`;

        if (
          lowerText.includes("balance") ||
          lowerText.includes("udhaar") ||
          lowerText.includes("hisab") ||
          lowerText.includes("baki") ||
          lowerText.includes("kitna")
        ) {
          reply = `Namaste ${customer.name}! 🙏\n\n${shopName} par ${balanceStatus}.\n\nKisi bhi prashna ke liye dukan par sampark karein. Dhanyawad!`;
        } else if (
          lowerText.includes("hi") ||
          lowerText.includes("hello") ||
          lowerText.includes("namaste") ||
          lowerText.includes("hey")
        ) {
          reply = `Namaste ${customer.name}! 🙏\n\nCredit Ledger me aapka swagat hai.\n${shopName} par ${balanceStatus}.\n\nApna hisab check karne ke liye kisi bhi samay *"Balance"* likh kar bhejein.`;
        } else {
          reply = `Namaste ${customer.name}! 🙏\n\nAapka message prapt hua.\n${shopName} par ${balanceStatus}.\n\nHisab janne ke liye *"Balance"* bhejein.`;
        }
      } else {
        // Unregistered customer
        const greetingName = senderName && senderName !== "Customer" ? ` ${senderName}` : "";
        if (
          lowerText.includes("balance") ||
          lowerText.includes("hisab") ||
          lowerText.includes("udhaar")
        ) {
          reply = `Namaste${greetingName}! 🙏\n\nAapka mobile number (+${sender}) hamare kisi bhi dukaan khate me registered nahi hai.\n\nKripya apne dukaandar se apna number add karwayein.`;
        } else {
          reply = `Namaste${greetingName}! 🙏\n\nCredit Ledger me aapka swagat hai. Apna udhaar hisab janne ke liye kripya apne dukaandar se sampark karein.`;
        }
      }

      console.log(`🤖 [AUTO-REPLYING TO ${sender}]:\n"${reply.replace(/\n/g, " ")}"`);
      await this.whatsAppService?.sendTextMessage(sender, reply);
      console.log(`✅ [AUTO-REPLY SENT] to +${sender}`);
    } catch (err: any) {
      console.error(`[AUTO-REPLY FAILED for ${sender}]:`, err.message || err);
    }
  }
}
