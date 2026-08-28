import { TransactionModel, ITransaction, TransactionType } from "../models/Transaction.model";
import { CustomerRepository } from "../repositories/CustomerRepository";
import { ShopModel } from "../models/Shop.model";
import { WhatsAppService } from "./WhatsAppService";

export class TransactionService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly whatsAppService: WhatsAppService
  ) {}

  async addTransaction(
    shopId: string,
    customerId: string,
    type: TransactionType,
    amount: number,
    note?: string
  ): Promise<{ transaction: ITransaction; balance: number }> {
    const transaction = await TransactionModel.create({ shopId, customerId, type, amount, note });

    const delta = type === "credit" ? amount : -amount;
    const customer = await this.customerRepository.incrementBalance(customerId, delta);
    if (!customer) throw new Error("Customer not found");

    const shop = await ShopModel.findById(shopId);
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

  async getTransactionsByCustomer(shopId: string, customerId: string): Promise<ITransaction[]> {
    return TransactionModel.find({ shopId, customerId }).sort({ createdAt: -1 });
  }

  async getDashboardStats(shopId: string): Promise<{ totalUdhaar: number; topDefaulters: any[] }> {
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
