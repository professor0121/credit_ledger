"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerReminderJob = registerReminderJob;
const node_cron_1 = __importDefault(require("node-cron"));
const Customer_model_1 = require("../models/Customer.model");
const Shop_model_1 = require("../models/Shop.model");
function registerReminderJob(whatsAppService) {
    // Every Monday 10:00 AM
    node_cron_1.default.schedule("0 10 * * 1", async () => {
        try {
            console.log("[CRON] Running weekly outstanding reminder check...");
            const customers = await Customer_model_1.CustomerModel.find({ currentBalance: { $gt: 0 } });
            for (const customer of customers) {
                const shop = await Shop_model_1.ShopModel.findById(customer.shopId);
                if (!shop)
                    continue;
                await whatsAppService.sendUdhaarNotification(customer.phone, {
                    shopName: shop.shopName || "Our Shop",
                    amount: "reminder",
                    balance: customer.currentBalance.toString(),
                });
            }
            console.log("[CRON] Reminder run completed.");
        }
        catch (err) {
            console.error("[CRON] Error during reminder run:", err);
        }
    });
}
