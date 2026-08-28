"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const ApiError_1 = require("../utils/ApiError");
class TransactionController {
    transactionService;
    constructor(transactionService) {
        this.transactionService = transactionService;
    }
    addTransaction = async (req, res, next) => {
        try {
            const shopId = req.shopId;
            if (!shopId)
                throw new ApiError_1.ApiError(401, "Unauthorized");
            const { customerId, type, amount, note } = req.body;
            if (!customerId || !type || amount === undefined) {
                throw new ApiError_1.ApiError(400, "Customer ID, type, and amount are required");
            }
            if (type !== "credit" && type !== "payment") {
                throw new ApiError_1.ApiError(400, "Transaction type must be 'credit' or 'payment'");
            }
            const parsedAmount = parseFloat(amount);
            if (isNaN(parsedAmount) || parsedAmount <= 0) {
                throw new ApiError_1.ApiError(400, "Transaction amount must be a positive number");
            }
            const result = await this.transactionService.addTransaction(shopId, customerId, type, parsedAmount, note);
            res.json({ success: true, ...result });
        }
        catch (err) {
            next(err);
        }
    };
    getDashboard = async (req, res, next) => {
        try {
            const shopId = req.shopId;
            if (!shopId)
                throw new ApiError_1.ApiError(401, "Unauthorized");
            const stats = await this.transactionService.getDashboardStats(shopId);
            res.json({ success: true, ...stats });
        }
        catch (err) {
            next(err);
        }
    };
}
exports.TransactionController = TransactionController;
