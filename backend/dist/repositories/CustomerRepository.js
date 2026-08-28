"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRepository = void 0;
const Customer_model_1 = require("../models/Customer.model");
const BaseRepository_1 = require("./BaseRepository");
class CustomerRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Customer_model_1.CustomerModel);
    }
    async incrementBalance(customerId, amount) {
        return this.model.findByIdAndUpdate(customerId, { $inc: { currentBalance: amount } }, { new: true });
    }
    async findByShop(shopId) {
        return this.model.find({ shopId });
    }
}
exports.CustomerRepository = CustomerRepository;
