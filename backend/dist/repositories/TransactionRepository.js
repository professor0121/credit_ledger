"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRepository = void 0;
const Transaction_model_1 = require("../models/Transaction.model");
const BaseRepository_1 = require("./BaseRepository");
class TransactionRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Transaction_model_1.TransactionModel);
    }
    async findByCustomer(customerId) {
        return this.model.find({ customerId }).sort({ createdAt: -1 });
    }
    async findByShop(shopId) {
        return this.model.find({ shopId }).sort({ createdAt: -1 });
    }
}
exports.TransactionRepository = TransactionRepository;
