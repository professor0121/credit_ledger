import axios from "axios";
import { config } from "../config/env";

interface OtpTemplateParams {
  otp: string;
}

interface NotificationTemplateParams {
  shopName: string;
  amount: string;
  balance: string;
}

export class WhatsAppService {
  private readonly baseUrl: string;
  private readonly token: string;
  private readonly isMock: boolean;

  constructor() {
    this.baseUrl = `https://graph.facebook.com/v20.0/${config.whatsApp.phoneNumberId}/messages`;
    this.token = config.whatsApp.accessToken;
    this.isMock = config.whatsApp.isMock;
  }

  private async send(payload: Record<string, unknown>): Promise<void> {
    if (this.isMock) {
      console.log("[MOCK WHATSAPP] Sending message payload:", JSON.stringify(payload, null, 2));
      return;
    }

    try {
      await axios.post(this.baseUrl, payload, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
    } catch (err: any) {
      console.error("WhatsApp send failed:", err?.response?.data || err.message);
    }
  }

  async sendOtp(phone: string, params: OtpTemplateParams): Promise<void> {
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

  async sendUdhaarNotification(phone: string, params: NotificationTemplateParams): Promise<void> {
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

  async sendTextMessage(phone: string, text: string): Promise<void> {
    await this.send({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: phone,
      type: "text",
      text: { body: text },
    });
  }
}
