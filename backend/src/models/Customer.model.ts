import { Schema, model, Document, Types } from "mongoose";

export interface ICustomer extends Document {
  shopId: Types.ObjectId;
  name: string;
  phone: string;
  photoUrl?: string;
  currentBalance: number;
  createdAt: Date;
}

const customerSchema = new Schema<ICustomer>({
  shopId: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  photoUrl: { type: String },
  currentBalance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const CustomerModel = model<ICustomer>("Customer", customerSchema);
