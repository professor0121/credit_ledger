"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
class CustomerService {
    customerRepository;
    cloudinaryService;
    constructor(customerRepository, cloudinaryService) {
        this.customerRepository = customerRepository;
        this.cloudinaryService = cloudinaryService;
    }
    async createCustomer(shopId, data) {
        const customerData = {
            shopId: shopId,
            name: data.name,
            phone: data.phone,
            currentBalance: 0,
        };
        if (data.photoPath) {
            const url = await this.cloudinaryService.uploadImage(data.photoPath, shopId, "customers");
            customerData.photoUrl = url;
        }
        return this.customerRepository.create(customerData);
    }
    async listCustomers(shopId) {
        return this.customerRepository.findByShop(shopId);
    }
    async getCustomerById(shopId, customerId) {
        const customer = await this.customerRepository.findById(customerId);
        if (!customer || customer.shopId.toString() !== shopId) {
            return null;
        }
        return customer;
    }
}
exports.CustomerService = CustomerService;
