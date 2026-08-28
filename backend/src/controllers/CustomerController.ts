import { Request, Response, NextFunction } from "express";
import { CustomerService } from "../services/CustomerService";
import { TransactionService } from "../services/TransactionService";
import { ApiError } from "../utils/ApiError";

export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly transactionService: TransactionService
  ) {}

  createCustomer = async (req: Request & { shopId?: string }, res: Response, next: NextFunction): Promise<void> => {
    try {
      const shopId = req.shopId;
      if (!shopId) throw new ApiError(401, "Unauthorized");

      const { name, phone } = req.body;
      if (!name || !phone) {
        throw new ApiError(400, "Name and phone are required");
      }

      const photoPath = req.file?.path;

      const customer = await this.customerService.createCustomer(shopId, {
        name,
        phone,
        photoPath,
      });

      res.status(201).json({ success: true, customer });
    } catch (err) {
      next(err);
    }
  };

  listCustomers = async (req: Request & { shopId?: string }, res: Response, next: NextFunction): Promise<void> => {
    try {
      const shopId = req.shopId;
      if (!shopId) throw new ApiError(401, "Unauthorized");

      const customers = await this.customerService.listCustomers(shopId);
      res.json({ success: true, customers });
    } catch (err) {
      next(err);
    }
  };

  getCustomerDetails = async (req: Request & { shopId?: string }, res: Response, next: NextFunction): Promise<void> => {
    try {
      const shopId = req.shopId;
      if (!shopId) throw new ApiError(401, "Unauthorized");

      const id = req.params.id as string;
      const customer = await this.customerService.getCustomerById(shopId as string, id);
      if (!customer) {
        throw new ApiError(404, "Customer not found");
      }

      const transactions = await this.transactionService.getTransactionsByCustomer(shopId as string, id);

      res.json({
        success: true,
        customer,
        transactions,
      });
    } catch (err) {
      next(err);
    }
  };
}
