import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/credit_ledger",
  jwtSecret: process.env.JWT_SECRET || "dev_jwt_secret_key_change_me_in_production",
  whatsApp: {
    phoneNumberId: process.env.WA_PHONE_NUMBER_ID || "",
    accessToken: process.env.WA_ACCESS_TOKEN || "",
    verifyToken: process.env.WA_VERIFY_TOKEN || "dev_verify_token",
    isMock: !process.env.WA_PHONE_NUMBER_ID || process.env.WA_PHONE_NUMBER_ID.includes("mock"),
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
    isMock: !process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME.includes("mock"),
  },
};
