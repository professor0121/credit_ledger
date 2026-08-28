"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerModel = void 0;
const mongoose_1 = require("mongoose");
const customerSchema = new mongoose_1.Schema({
    shopId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Shop", required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    photoUrl: { type: String },
    currentBalance: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});
exports.CustomerModel = (0, mongoose_1.model)("Customer", customerSchema);
