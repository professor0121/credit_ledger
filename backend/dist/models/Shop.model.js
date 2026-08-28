"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopModel = void 0;
const mongoose_1 = require("mongoose");
const shopSchema = new mongoose_1.Schema({
    ownerName: { type: String, required: true },
    shopName: { type: String, required: true },
    whatsappNumber: { type: String, required: true, unique: true },
    logoUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
});
exports.ShopModel = (0, mongoose_1.model)("Shop", shopSchema);
