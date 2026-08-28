"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomerRouter = createCustomerRouter;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const os_1 = __importDefault(require("os"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const upload = (0, multer_1.default)({ dest: os_1.default.tmpdir() });
function createCustomerRouter(customerController) {
    const router = (0, express_1.Router)();
    router.use(authMiddleware_1.authMiddleware);
    router.post("/", upload.single("photo"), customerController.createCustomer);
    router.get("/", customerController.listCustomers);
    router.get("/:id", customerController.getCustomerDetails);
    return router;
}
