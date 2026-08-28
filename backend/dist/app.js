"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
// Import Repositories
const CustomerRepository_1 = require("./repositories/CustomerRepository");
// Import Services
const WhatsAppService_1 = require("./services/WhatsAppService");
const CloudinaryService_1 = require("./services/CloudinaryService");
const AuthService_1 = require("./services/AuthService");
const CustomerService_1 = require("./services/CustomerService");
const TransactionService_1 = require("./services/TransactionService");
// Import Controllers
const AuthController_1 = require("./controllers/AuthController");
const CustomerController_1 = require("./controllers/CustomerController");
const TransactionController_1 = require("./controllers/TransactionController");
const WebhookController_1 = require("./controllers/WebhookController");
// Import Routes
const auth_routes_1 = require("./routes/auth.routes");
const customer_routes_1 = require("./routes/customer.routes");
const transaction_routes_1 = require("./routes/transaction.routes");
const webhook_routes_1 = require("./routes/webhook.routes");
// Import Jobs
const reminder_cron_1 = require("./jobs/reminder.cron");
// Import Middleware
const errorHandler_1 = require("./middleware/errorHandler");
const testerHtml_1 = require("./utils/testerHtml");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Dependency Injection (Composition Root)
const whatsAppService = new WhatsAppService_1.WhatsAppService();
const cloudinaryService = new CloudinaryService_1.CloudinaryService();
const customerRepository = new CustomerRepository_1.CustomerRepository();
const authService = new AuthService_1.AuthService(whatsAppService);
const customerService = new CustomerService_1.CustomerService(customerRepository, cloudinaryService);
const transactionService = new TransactionService_1.TransactionService(customerRepository, whatsAppService);
const authController = new AuthController_1.AuthController(authService);
const customerController = new CustomerController_1.CustomerController(customerService, transactionService);
const transactionController = new TransactionController_1.TransactionController(transactionService);
const webhookController = new WebhookController_1.WebhookController();
// Routes
app.use("/api/auth", (0, auth_routes_1.createAuthRouter)(authController));
app.use("/api/customers", (0, customer_routes_1.createCustomerRouter)(customerController));
app.use("/api/transactions", (0, transaction_routes_1.createTransactionRouter)(transactionController));
app.use("/api/dashboard", (0, transaction_routes_1.createDashboardRouter)(transactionController));
app.get("/", (_req, res) => {
    res.send(testerHtml_1.testerHtml);
});
app.use("/api/webhook", (0, webhook_routes_1.createWebhookRouter)(webhookController));
// Global Error Handler
app.use(errorHandler_1.errorHandler);
// Connect to Database
(0, database_1.connectDatabase)().then(() => {
    if (!process.env.VERCEL) {
        // Register Scheduled Jobs (only when running as a persistent server)
        (0, reminder_cron_1.registerReminderJob)(whatsAppService);
    }
}).catch((err) => {
    console.error("Failed to connect to database:", err);
});
// Start listening only if not running on Vercel
if (!process.env.VERCEL) {
    app.listen(env_1.config.port, () => {
        console.log(`Server is running on port ${env_1.config.port}`);
    });
}
exports.default = app;
