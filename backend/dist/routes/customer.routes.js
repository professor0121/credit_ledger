"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomerRouter = createCustomerRouter;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const authMiddleware_1 = require("../middleware/authMiddleware");
// Ensure uploads directory exists
const uploadDir = path_1.default.join(__dirname, "../../uploads");
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const upload = (0, multer_1.default)({ dest: uploadDir });
function createCustomerRouter(customerController) {
    const router = (0, express_1.Router)();
    router.use(authMiddleware_1.authMiddleware);
    router.post("/", upload.single("photo"), customerController.createCustomer);
    router.get("/", customerController.listCustomers);
    router.get("/:id", customerController.getCustomerDetails);
    return router;
}
