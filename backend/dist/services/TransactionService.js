"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const Transaction_model_1 = require("../models/Transaction.model");
const Shop_model_1 = require("../models/Shop.model");
class TransactionService {
    customerRepository;
    whatsAppService;
    constructor(customerRepository, whatsAppService) {
        this.customerRepository = customerRepository;
        this.whatsAppService = whatsAppService;
    }
    async addTransaction(shopId, customerId, type, amount, note) {
        const transaction = await Transaction_model_1.TransactionModel.create({ shopId, customerId, type, amount, note });
        const delta = type === "credit" ? amount : -amount;
        const customer = await this.customerRepository.incrementBalance(customerId, delta);
        if (!customer)
            throw new Error("Customer not found");
        const shop = await Shop_model_1.ShopModel.findById(shopId);
        if (shop) {
            // fire-and-forget — don't block the API response
            void this.whatsAppService.sendUdhaarNotification(customer.phone, {
                shopName: shop.shopName || "Our Shop",
                amount: amount.toString(),
                balance: customer.currentBalance.toString(),
            });
        }
        return { transaction, balance: customer.currentBalance };
    }
    async getTransactionsByCustomer(shopId, customerId) {
        return Transaction_model_1.TransactionModel.find({ shopId, customerId }).sort({ createdAt: -1 });
    }
    async getDashboardStats(shopId) {
        const customers = await this.customerRepository.findByShop(shopId);
        let totalUdhaar = 0;
        const activeDefaulters = [];
        for (const customer of customers) {
            if (customer.currentBalance > 0) {
                totalUdhaar += customer.currentBalance;
                activeDefaulters.push({
                    id: customer._id,
                    name: customer.name,
                    phone: customer.phone,
                    photoUrl: customer.photoUrl,
                    currentBalance: customer.currentBalance,
                });
            }
        }
        // Sort by currentBalance descending
        const topDefaulters = activeDefaulters
            .sort((a, b) => b.currentBalance - a.currentBalance)
            .slice(0, 5);
        return {
            totalUdhaar,
            topDefaulters,
        };
    }
}
exports.TransactionService = TransactionService;
