import { ICustomer } from "../models/Customer.model";
import { CustomerRepository } from "../repositories/CustomerRepository";
import { CloudinaryService } from "./CloudinaryService";

export class CustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async createCustomer(
    shopId: string,
    data: { name: string; phone: string; photoPath?: string }
  ): Promise<ICustomer> {
    const customerData: Partial<ICustomer> = {
      shopId: shopId as any,
      name: data.name,
      phone: data.phone,
      currentBalance: 0,
    };

    if (data.photoPath) {
      const url = await this.cloudinaryService.uploadImage(data.photoPath);
      customerData.photoUrl = url;
    }

    return this.customerRepository.create(customerData);
  }

  async listCustomers(shopId: string): Promise<ICustomer[]> {
    return this.customerRepository.findByShop(shopId);
  }

  async getCustomerById(shopId: string, customerId: string): Promise<ICustomer | null> {
    const customer = await this.customerRepository.findById(customerId);
    if (!customer || customer.shopId.toString() !== shopId) {
      return null;
    }
    return customer;
  }
}
