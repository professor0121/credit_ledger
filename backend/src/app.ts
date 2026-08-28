import express from "express";
import cors from "cors";
import path from "path";
import { config } from "./config/env";
import { connectDatabase } from "./config/database";

// Import Repositories
import { CustomerRepository } from "./repositories/CustomerRepository";

// Import Services
import { WhatsAppService } from "./services/WhatsAppService";
import { CloudinaryService } from "./services/CloudinaryService";
import { AuthService } from "./services/AuthService";
import { CustomerService } from "./services/CustomerService";
import { TransactionService } from "./services/TransactionService";

// Import Controllers
import { AuthController } from "./controllers/AuthController";
import { CustomerController } from "./controllers/CustomerController";
import { TransactionController } from "./controllers/TransactionController";
import { WebhookController } from "./controllers/WebhookController";

// Import Routes
import { createAuthRouter } from "./routes/auth.routes";
import { createCustomerRouter } from "./routes/customer.routes";
import { createTransactionRouter, createDashboardRouter } from "./routes/transaction.routes";
import { createWebhookRouter } from "./routes/webhook.routes";

// Import Jobs
import { registerReminderJob } from "./jobs/reminder.cron";

// Import Middleware
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dependency Injection (Composition Root)
const whatsAppService = new WhatsAppService();
const cloudinaryService = new CloudinaryService();
const customerRepository = new CustomerRepository();

const authService = new AuthService(whatsAppService);
const customerService = new CustomerService(customerRepository, cloudinaryService);
const transactionService = new TransactionService(customerRepository, whatsAppService);

const authController = new AuthController(authService);
const customerController = new CustomerController(customerService, transactionService);
const transactionController = new TransactionController(transactionService);
const webhookController = new WebhookController();

// Routes
app.use("/api/auth", createAuthRouter(authController));
app.use("/api/customers", createCustomerRouter(customerController));
app.use("/api/transactions", createTransactionRouter(transactionController));
app.use("/api/dashboard", createDashboardRouter(transactionController));
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "../webhook-tester.html"));
});
app.use("/api/webhook", createWebhookRouter(webhookController));

// Global Error Handler
app.use(errorHandler);

// Connect to Database
connectDatabase().then(() => {
  if (!process.env.VERCEL) {
    // Register Scheduled Jobs (only when running as a persistent server)
    registerReminderJob(whatsAppService);
  }
}).catch((err) => {
  console.error("Failed to connect to database:", err);
});

// Start listening only if not running on Vercel
if (!process.env.VERCEL) {
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
}

export default app;
