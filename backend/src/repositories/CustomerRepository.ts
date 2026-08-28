import { CustomerModel, ICustomer } from "../models/Customer.model";
import { BaseRepository } from "./BaseRepository";

export class CustomerRepository extends BaseRepository<ICustomer> {
  constructor() {
    super(CustomerModel);
  }

  async incrementBalance(customerId: string, amount: number): Promise<ICustomer | null> {
    return this.model.findByIdAndUpdate(
      customerId,
      { $inc: { currentBalance: amount } },
      { new: true }
    );
  }

  async findByShop(shopId: string): Promise<ICustomer[]> {
    return this.model.find({ shopId });
  }
}
