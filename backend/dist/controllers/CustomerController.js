"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerController = void 0;
const ApiError_1 = require("../utils/ApiError");
class CustomerController {
    customerService;
    transactionService;
    constructor(customerService, transactionService) {
        this.customerService = customerService;
        this.transactionService = transactionService;
    }
    createCustomer = async (req, res, next) => {
        try {
            const shopId = req.shopId;
            if (!shopId)
                throw new ApiError_1.ApiError(401, "Unauthorized");
            const { name, phone } = req.body;
            if (!name || !phone) {
                throw new ApiError_1.ApiError(400, "Name and phone are required");
            }
            const photoPath = req.file?.path;
            const customer = await this.customerService.createCustomer(shopId, {
                name,
                phone,
                photoPath,
            });
            res.status(201).json({ success: true, customer });
        }
        catch (err) {
            next(err);
        }
    };
    listCustomers = async (req, res, next) => {
        try {
            const shopId = req.shopId;
            if (!shopId)
                throw new ApiError_1.ApiError(401, "Unauthorized");
            const customers = await this.customerService.listCustomers(shopId);
            res.json({ success: true, customers });
        }
        catch (err) {
            next(err);
        }
    };
    getCustomerDetails = async (req, res, next) => {
        try {
            const shopId = req.shopId;
            if (!shopId)
                throw new ApiError_1.ApiError(401, "Unauthorized");
            const id = req.params.id;
            const customer = await this.customerService.getCustomerById(shopId, id);
            if (!customer) {
                throw new ApiError_1.ApiError(404, "Customer not found");
            }
            const transactions = await this.transactionService.getTransactionsByCustomer(shopId, id);
            res.json({
                success: true,
                customer,
                transactions,
            });
        }
        catch (err) {
            next(err);
        }
    };
}
exports.CustomerController = CustomerController;
