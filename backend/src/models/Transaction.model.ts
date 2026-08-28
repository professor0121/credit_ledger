import { Schema, model, Document, Types } from "mongoose";

export type TransactionType = "credit" | "payment";

export interface ITransaction extends Document {
  shopId: Types.ObjectId;
  customerId: Types.ObjectId;
  type: TransactionType;
  amount: number;
  note?: string;
  createdAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
  shopId: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
  customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
  type: { type: String, enum: ["credit", "payment"], required: true },
  amount: { type: Number, required: true },
  note: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const TransactionModel = model<ITransaction>("Transaction", transactionSchema);
