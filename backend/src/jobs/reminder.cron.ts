import cron from "node-cron";
import { CustomerModel } from "../models/Customer.model";
import { ShopModel } from "../models/Shop.model";
import { WhatsAppService } from "../services/WhatsAppService";

export function registerReminderJob(whatsAppService: WhatsAppService): void {
  // Every Monday 10:00 AM
  cron.schedule("0 10 * * 1", async () => {
    try {
      console.log("[CRON] Running weekly outstanding reminder check...");
      const customers = await CustomerModel.find({ currentBalance: { $gt: 0 } });
      for (const customer of customers) {
        const shop = await ShopModel.findById(customer.shopId);
        if (!shop) continue;
        await whatsAppService.sendUdhaarNotification(customer.phone, {
          shopName: shop.shopName || "Our Shop",
          amount: "reminder",
          balance: customer.currentBalance.toString(),
        });
      }
      console.log("[CRON] Reminder run completed.");
    } catch (err) {
      console.error("[CRON] Error during reminder run:", err);
    }
  });
}
