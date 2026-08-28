import mongoose from "mongoose";
import { config } from "./env";

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}
