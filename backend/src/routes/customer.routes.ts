import { Router } from "express";
import multer from "multer";
import os from "os";
import { CustomerController } from "../controllers/CustomerController";
import { authMiddleware } from "../middleware/authMiddleware";

const upload = multer({ dest: os.tmpdir() });

export function createCustomerRouter(customerController: CustomerController): Router {
  const router = Router();
  router.use(authMiddleware);

  router.post("/", upload.single("photo"), customerController.createCustomer);
  router.get("/", customerController.listCustomers);
  router.get("/:id", customerController.getCustomerDetails);

  return router;
}
