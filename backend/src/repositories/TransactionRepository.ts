import { TransactionModel, ITransaction } from "../models/Transaction.model";
import { BaseRepository } from "./BaseRepository";

export class TransactionRepository extends BaseRepository<ITransaction> {
  constructor() {
    super(TransactionModel);
  }

  async findByCustomer(customerId: string): Promise<ITransaction[]> {
    return this.model.find({ customerId }).sort({ createdAt: -1 });
  }

  async findByShop(shopId: string): Promise<ITransaction[]> {
    return this.model.find({ shopId }).sort({ createdAt: -1 });
  }
}
