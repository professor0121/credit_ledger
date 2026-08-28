import jwt from "jsonwebtoken";
import { OtpModel } from "../models/Otp.model";
import { ShopModel, IShop } from "../models/Shop.model";
import { WhatsAppService } from "./WhatsAppService";
import { config } from "../config/env";

export class AuthService {
  constructor(private readonly whatsAppService: WhatsAppService) {}

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async requestOtp(phone: string): Promise<void> {
    const otp = this.generateOtp();
    await OtpModel.deleteMany({ phone });
    await OtpModel.create({
      phone,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    await this.whatsAppService.sendOtp(phone, { otp });
  }

  async verifyOtp(phone: string, otp: string): Promise<{ token: string; shop: IShop }> {
    const record = await OtpModel.findOne({ phone, otp });
    if (!record) throw new Error("Invalid or expired OTP");
    await OtpModel.deleteMany({ phone });

    let shop = await ShopModel.findOne({ whatsappNumber: phone });
    if (!shop) {
      shop = await ShopModel.create({ whatsappNumber: phone, ownerName: "", shopName: "" });
    }

    const token = jwt.sign({ shopId: shop._id }, config.jwtSecret, {
      expiresIn: "30d",
    });

    return { token, shop };
  }
}
