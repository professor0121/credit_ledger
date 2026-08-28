import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService";
import { ApiError } from "../utils/ApiError";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  sendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { phone } = req.body;
      if (!phone) {
        throw new ApiError(400, "Phone number is required");
      }
      await this.authService.requestOtp(phone);
      res.json({ success: true, message: "OTP sent successfully" });
    } catch (err) {
      next(err);
    }
  };

  verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { phone, otp } = req.body;
      if (!phone || !otp) {
        throw new ApiError(400, "Phone number and OTP are required");
      }
      const result = await this.authService.verifyOtp(phone, otp);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  };
}
