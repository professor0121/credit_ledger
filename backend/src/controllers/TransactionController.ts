import { Request, Response, NextFunction } from "express";
import { TransactionService } from "../services/TransactionService";
import { ApiError } from "../utils/ApiError";

export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  addTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const shopId = req.shopId;
      if (!shopId) throw new ApiError(401, "Unauthorized");

      const { customerId, type, amount, note } = req.body;
      if (!customerId || !type || amount === undefined) {
        throw new ApiError(400, "Customer ID, type, and amount are required");
      }

      if (type !== "credit" && type !== "payment") {
        throw new ApiError(400, "Transaction type must be 'credit' or 'payment'");
      }

      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new ApiError(400, "Transaction amount must be a positive number");
      }

      const result = await this.transactionService.addTransaction(
        shopId,
        customerId,
        type,
        parsedAmount,
        note
      );

      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  };

  getDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const shopId = req.shopId;
      if (!shopId) throw new ApiError(401, "Unauthorized");

      const stats = await this.transactionService.getDashboardStats(shopId);
      res.json({ success: true, ...stats });
    } catch (err) {
      next(err);
    }
  };
}
