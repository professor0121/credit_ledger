import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { CustomerController } from "../controllers/CustomerController";
import { authMiddleware } from "../middleware/authMiddleware";

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ dest: uploadDir });

export function createCustomerRouter(customerController: CustomerController): Router {
  const router = Router();
  router.use(authMiddleware);

  router.post("/", upload.single("photo"), customerController.createCustomer);
  router.get("/", customerController.listCustomers);
  router.get("/:id", customerController.getCustomerDetails);

  return router;
}
