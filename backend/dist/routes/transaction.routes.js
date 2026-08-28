"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransactionRouter = createTransactionRouter;
exports.createDashboardRouter = createDashboardRouter;
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
function createTransactionRouter(transactionController) {
    const router = (0, express_1.Router)();
    router.use(authMiddleware_1.authMiddleware);
    router.post("/", transactionController.addTransaction);
    return router;
}
function createDashboardRouter(transactionController) {
    const router = (0, express_1.Router)();
    router.use(authMiddleware_1.authMiddleware);
    router.get("/", transactionController.getDashboard);
    return router;
}
