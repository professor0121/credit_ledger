import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

export function createAuthRouter(authController: AuthController): Router {
  const router = Router();
  router.post("/send-otp", authController.sendOtp);
  router.post("/verify-otp", authController.verifyOtp);
  return router;
}
