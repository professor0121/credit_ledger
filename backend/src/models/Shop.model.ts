import { Schema, model, Document } from "mongoose";

export interface IShop extends Document {
  ownerName: string;
  shopName: string;
  whatsappNumber: string;
  logoUrl?: string;
  createdAt: Date;
}

const shopSchema = new Schema<IShop>({
  ownerName: { type: String, required: true },
  shopName: { type: String, required: true },
  whatsappNumber: { type: String, required: true, unique: true },
  logoUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const ShopModel = model<IShop>("Shop", shopSchema);
