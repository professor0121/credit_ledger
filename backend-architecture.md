# Udhaar Khata App — Backend Architecture Doc

**Stack:** Node.js + Express + TypeScript (strict mode) + OOP + MongoDB (Mongoose) + WhatsApp Cloud API + Cloudinary
**Explicitly excluded:** Redis, BullMQ / any job queue (MVP simplicity — direct calls + `node-cron` for scheduling)

---

## 1. Tech Stack

| Layer | Choice |
|---|---|
| Language | TypeScript (`strict: true`) |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | Phone + OTP (JWT session) |
| Messaging | WhatsApp Cloud API (Meta) |
| Scheduling | `node-cron` |
| Image Storage | Cloudinary (folder-per-shop) |
| Architecture Style | OOP — classes for Services, Repositories, Controllers |

---

## 2. Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── env.ts
│   │   ├── database.ts
│   │   └── cloudinary.ts
│   ├── models/
│   │   ├── Shop.model.ts
│   │   ├── Customer.model.ts
│   │   ├── Transaction.model.ts
│   │   └── Otp.model.ts
│   ├── repositories/
│   │   ├── BaseRepository.ts
│   │   ├── ShopRepository.ts
│   │   ├── CustomerRepository.ts
│   │   └── TransactionRepository.ts
│   ├── services/
│   │   ├── AuthService.ts
│   │   ├── WhatsAppService.ts
│   │   ├── CloudinaryService.ts
│   │   ├── CustomerService.ts
│   │   └── TransactionService.ts
│   ├── controllers/
│   │   ├── AuthController.ts
│   │   ├── CustomerController.ts
│   │   └── TransactionController.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── customer.routes.ts
│   │   └── transaction.routes.ts
│   ├── middleware/
│   │   ├── authMiddleware.ts
│   │   └── errorHandler.ts
│   ├── jobs/
│   │   └── reminder.cron.ts
│   ├── types/
│   │   └── express.d.ts
│   ├── utils/
│   │   └── ApiError.ts
│   └── app.ts
├── tsconfig.json
├── package.json
└── .env
```

---

## 3. `tsconfig.json` (strict mode)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"]
}
```

---

## 4. Mongoose Models (TypeScript interfaces + schema)

### `models/Shop.model.ts`
```ts
import { Schema, model, Document } from "mongoose";

export interface IShop extends Document {
  ownerName: string;
  shopName: string;
  whatsappNumber: string;
  logoUrl?: string;
  createdAt: Date;
}

const shopSchema = new Schema<IShop>({
  ownerName: { type: String, required: true },
  shopName: { type: String, required: true },
  whatsappNumber: { type: String, required: true, unique: true },
  logoUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const ShopModel = model<IShop>("Shop", shopSchema);
```

### `models/Customer.model.ts`
```ts
import { Schema, model, Document, Types } from "mongoose";

export interface ICustomer extends Document {
  shopId: Types.ObjectId;
  name: string;
  phone: string;
  photoUrl?: string;
  currentBalance: number;
  createdAt: Date;
}

const customerSchema = new Schema<ICustomer>({
  shopId: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  photoUrl: { type: String },
  currentBalance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const CustomerModel = model<ICustomer>("Customer", customerSchema);
```

### `models/Transaction.model.ts`
```ts
import { Schema, model, Document, Types } from "mongoose";

export type TransactionType = "credit" | "payment";

export interface ITransaction extends Document {
  shopId: Types.ObjectId;
  customerId: Types.ObjectId;
  type: TransactionType;
  amount: number;
  note?: string;
  createdAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
  shopId: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
  customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
  type: { type: String, enum: ["credit", "payment"], required: true },
  amount: { type: Number, required: true },
  note: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const TransactionModel = model<ITransaction>("Transaction", transactionSchema);
```

### `models/Otp.model.ts`
```ts
import { Schema, model, Document } from "mongoose";

export interface IOtp extends Document {
  phone: string;
  otp: string;
  expiresAt: Date;
}

const otpSchema = new Schema<IOtp>({
  phone: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OtpModel = model<IOtp>("Otp", otpSchema);
```

---

## 5. OOP Layers

### Base Repository (generic, reusable)

```ts
// repositories/BaseRepository.ts
import { Model, Document, FilterQuery, UpdateQuery } from "mongoose";

export abstract class BaseRepository<T extends Document> {
  protected constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter);
  }

  async find(filter: FilterQuery<T>): Promise<T[]> {
    return this.model.find(filter);
  }

  async updateById(id: string, update: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, update, { new: true });
  }

  async deleteById(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id);
  }
}
```

### `repositories/CustomerRepository.ts`

```ts
import { CustomerModel, ICustomer } from "../models/Customer.model";
import { BaseRepository } from "./BaseRepository";

export class CustomerRepository extends BaseRepository<ICustomer> {
  constructor() {
    super(CustomerModel);
  }

  async incrementBalance(customerId: string, amount: number): Promise<ICustomer | null> {
    return this.model.findByIdAndUpdate(
      customerId,
      { $inc: { currentBalance: amount } },
      { new: true }
    );
  }

  async findByShop(shopId: string): Promise<ICustomer[]> {
    return this.model.find({ shopId });
  }
}
```

### `services/CloudinaryService.ts` (folder-per-shop image storage)

```ts
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
      api_key: process.env.CLOUDINARY_API_KEY as string,
      api_secret: process.env.CLOUDINARY_API_SECRET as string,
    });
  }

  /**
   * Uploads an image into a shop-specific folder.
   * Structure: udhaar-app/{shopId}/customers/{filename}
   *            udhaar-app/{shopId}/shop-logo/{filename}
   */
  async uploadImage(
    filePath: string,
    shopId: string,
    subfolder: "customers" | "shop-logo"
  ): Promise<string> {
    const result: UploadApiResponse = await cloudinary.uploader.upload(filePath, {
      folder: `udhaar-app/${shopId}/${subfolder}`,
      resource_type: "image",
    });
    return result.secure_url;
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
```

### `services/WhatsAppService.ts`

```ts
import axios from "axios";

interface OtpTemplateParams {
  otp: string;
}

interface NotificationTemplateParams {
  shopName: string;
  amount: string;
  balance: string;
}

export class WhatsAppService {
  private readonly baseUrl: string;
  private readonly token: string;

  constructor() {
    this.baseUrl = `https://graph.facebook.com/v20.0/${process.env.WA_PHONE_NUMBER_ID}/messages`;
    this.token = process.env.WA_ACCESS_TOKEN as string;
  }

  private async send(payload: Record<string, unknown>): Promise<void> {
    try {
      await axios.post(this.baseUrl, payload, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
    } catch (err) {
      console.error("WhatsApp send failed:", err);
    }
  }

  async sendOtp(phone: string, params: OtpTemplateParams): Promise<void> {
    await this.send({
      messaging_product: "whatsapp",
      to: phone,
      type: "template",
      template: {
        name: "otp_login",
        language: { code: "en" },
        components: [{ type: "body", parameters: [{ type: "text", text: params.otp }] }],
      },
    });
  }

  async sendUdhaarNotification(phone: string, params: NotificationTemplateParams): Promise<void> {
    await this.send({
      messaging_product: "whatsapp",
      to: phone,
      type: "template",
      template: {
        name: "udhaar_notification",
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: params.shopName },
              { type: "text", text: params.amount },
              { type: "text", text: params.balance },
            ],
          },
        ],
      },
    });
  }
}
```

### `services/AuthService.ts`

```ts
import jwt from "jsonwebtoken";
import { OtpModel } from "../models/Otp.model";
import { ShopModel, IShop } from "../models/Shop.model";
import { WhatsAppService } from "./WhatsAppService";

export class AuthService {
  constructor(private readonly whatsAppService: WhatsAppService) {}

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async requestOtp(phone: string): Promise<void> {
    const otp = this.generateOtp();
    await OtpModel.deleteMany({ phone });
    await OtpModel.create({
      phone,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    await this.whatsAppService.sendOtp(phone, { otp });
  }

  async verifyOtp(phone: string, otp: string): Promise<{ token: string; shop: IShop }> {
    const record = await OtpModel.findOne({ phone, otp });
    if (!record) throw new Error("Invalid or expired OTP");
    await OtpModel.deleteMany({ phone });

    let shop = await ShopModel.findOne({ whatsappNumber: phone });
    if (!shop) {
      shop = await ShopModel.create({ whatsappNumber: phone, ownerName: "", shopName: "" });
    }

    const token = jwt.sign({ shopId: shop._id }, process.env.JWT_SECRET as string, {
      expiresIn: "30d",
    });

    return { token, shop };
  }
}
```

### `services/TransactionService.ts` (ties it together)

```ts
import { TransactionModel, ITransaction, TransactionType } from "../models/Transaction.model";
import { CustomerRepository } from "../repositories/CustomerRepository";
import { ShopModel } from "../models/Shop.model";
import { WhatsAppService } from "./WhatsAppService";

export class TransactionService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly whatsAppService: WhatsAppService
  ) {}

  async addTransaction(
    shopId: string,
    customerId: string,
    type: TransactionType,
    amount: number,
    note?: string
  ): Promise<{ transaction: ITransaction; balance: number }> {
    const transaction = await TransactionModel.create({ shopId, customerId, type, amount, note });

    const delta = type === "credit" ? amount : -amount;
    const customer = await this.customerRepository.incrementBalance(customerId, delta);
    if (!customer) throw new Error("Customer not found");

    const shop = await ShopModel.findById(shopId);
    if (shop) {
      // fire-and-forget — don't block the API response
      void this.whatsAppService.sendUdhaarNotification(customer.phone, {
        shopName: shop.shopName,
        amount: amount.toString(),
        balance: customer.currentBalance.toString(),
      });
    }

    return { transaction, balance: customer.currentBalance };
  }
}
```

### `controllers/TransactionController.ts`

```ts
import { Request, Response, NextFunction } from "express";
import { TransactionService } from "../services/TransactionService";

export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  addTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const shopId = req.shopId as string; // set by authMiddleware
      const { customerId, type, amount, note } = req.body;

      const result = await this.transactionService.addTransaction(
        shopId,
        customerId,
        type,
        amount,
        note
      );

      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  };
}
```

### Wiring it up (composition root) — `app.ts` (excerpt)

```ts
import { CustomerRepository } from "./repositories/CustomerRepository";
import { WhatsAppService } from "./services/WhatsAppService";
import { AuthService } from "./services/AuthService";
import { TransactionService } from "./services/TransactionService";
import { TransactionController } from "./controllers/TransactionController";

const whatsAppService = new WhatsAppService();
const customerRepository = new CustomerRepository();

const authService = new AuthService(whatsAppService);
const transactionService = new TransactionService(customerRepository, whatsAppService);

const transactionController = new TransactionController(transactionService);
```

---

## 6. Auth Middleware

```ts
// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { shopId: string };
    req.shopId = decoded.shopId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}
```

```ts
// types/express.d.ts
declare namespace Express {
  export interface Request {
    shopId?: string;
  }
}
```

---

## 7. Scheduled Reminders (no queue — `node-cron`)

```ts
// jobs/reminder.cron.ts
import cron from "node-cron";
import { CustomerModel } from "../models/Customer.model";
import { ShopModel } from "../models/Shop.model";
import { WhatsAppService } from "../services/WhatsAppService";

export function registerReminderJob(whatsAppService: WhatsAppService): void {
  // Every Monday 10:00 AM
  cron.schedule("0 10 * * 1", async () => {
    const customers = await CustomerModel.find({ currentBalance: { $gt: 0 } });
    for (const customer of customers) {
      const shop = await ShopModel.findById(customer.shopId);
      if (!shop) continue;
      await whatsAppService.sendUdhaarNotification(customer.phone, {
        shopName: shop.shopName,
        amount: "reminder",
        balance: customer.currentBalance.toString(),
      });
    }
  });
}
```

---

## 8. Cloudinary Folder Convention

```
udhaar-app/
├── {shopId}/
│   ├── shop-logo/
│   │   └── logo.jpg
│   └── customers/
│       ├── {customerId}.jpg
│       └── ...
```

Usage in a controller (multer for multipart upload → Cloudinary):

```ts
const cloudinaryService = new CloudinaryService();

const url = await cloudinaryService.uploadImage(
  req.file!.path,
  req.shopId as string,
  "customers"
);
customer.photoUrl = url;
```

---

## 9. Environment Variables (`.env`)

```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret

WA_PHONE_NUMBER_ID=your_meta_phone_number_id
WA_ACCESS_TOKEN=your_meta_access_token

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 10. Core API Endpoints (MVP)

| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/send-otp` | No | Send OTP to shopkeeper's WhatsApp |
| POST | `/api/auth/verify-otp` | No | Verify OTP, return JWT |
| POST | `/api/customers` | Yes | Add customer (with optional photo upload) |
| GET | `/api/customers` | Yes | List customers for the logged-in shop |
| GET | `/api/customers/:id` | Yes | Customer detail + transaction history |
| POST | `/api/transactions` | Yes | Add credit/payment entry |
| GET | `/api/dashboard` | Yes | Total udhaar, top defaulters |

---

## 11. Not Included in MVP (deferred)

- Redis / BullMQ (queueing, rate-limited bulk sends, distributed job retries)
- Multi-server horizontal scaling considerations
- Payment gateway (Razorpay/UPI link) integration
