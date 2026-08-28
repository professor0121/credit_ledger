"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModel = void 0;
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    shopId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Shop", required: true },
    customerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Customer", required: true },
    type: { type: String, enum: ["credit", "payment"], required: true },
    amount: { type: Number, required: true },
    note: { type: String },
    createdAt: { type: Date, default: Date.now },
});
exports.TransactionModel = (0, mongoose_1.model)("Transaction", transactionSchema);
