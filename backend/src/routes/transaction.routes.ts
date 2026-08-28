import { Router } from "express";
import { TransactionController } from "../controllers/TransactionController";
import { authMiddleware } from "../middleware/authMiddleware";

export function createTransactionRouter(transactionController: TransactionController): Router {
  const router = Router();
  router.use(authMiddleware);

  router.post("/", transactionController.addTransaction);

  return router;
}

export function createDashboardRouter(transactionController: TransactionController): Router {
  const router = Router();
  router.use(authMiddleware);

  router.get("/", transactionController.getDashboard);

  return router;
}
