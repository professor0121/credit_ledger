"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./config/env");
const Otp_model_1 = require("./models/Otp.model");
const Shop_model_1 = require("./models/Shop.model");
const Customer_model_1 = require("./models/Customer.model");
const Transaction_model_1 = require("./models/Transaction.model");
const BASE_URL = `http://localhost:${env_1.config.port}`;
const TEST_PHONE = "916269880874";
async function runSmokeTest() {
    console.log("=== STARTING BACKEND SMOKE TEST ===");
    // Connect to DB directly for prep and validation
    await mongoose_1.default.connect(env_1.config.mongoUri);
    console.log("Connected to MongoDB for test verification.");
    // Clean database of previous test run data
    const existingShop = await Shop_model_1.ShopModel.findOne({ whatsappNumber: TEST_PHONE });
    if (existingShop) {
        await Transaction_model_1.TransactionModel.deleteMany({ shopId: existingShop._id });
        await Customer_model_1.CustomerModel.deleteMany({ shopId: existingShop._id });
        await Shop_model_1.ShopModel.deleteOne({ _id: existingShop._id });
    }
    await Otp_model_1.OtpModel.deleteMany({ phone: TEST_PHONE });
    console.log("Cleared old test data.");
    // 1. Request OTP
    console.log("\n1. Requesting OTP...");
    const otpRes = await axios_1.default.post(`${BASE_URL}/api/auth/send-otp`, {
        phone: TEST_PHONE,
    });
    if (!otpRes.data.success)
        throw new Error("Request OTP failed");
    console.log("OTP requested successfully.");
    // Fetch OTP directly from MongoDB to verify
    const otpRecord = await Otp_model_1.OtpModel.findOne({ phone: TEST_PHONE });
    if (!otpRecord)
        throw new Error("OTP record not found in database");
    console.log("Retrieved OTP from database:", otpRecord.otp);
    // 2. Verify OTP
    console.log("\n2. Verifying OTP...");
    const verifyRes = await axios_1.default.post(`${BASE_URL}/api/auth/verify-otp`, {
        phone: TEST_PHONE,
        otp: otpRecord.otp,
    });
    if (!verifyRes.data.success || !verifyRes.data.token) {
        throw new Error("Verify OTP failed");
    }
    const token = verifyRes.data.token;
    console.log("Verified successfully. JWT Token acquired.");
    const authHeaders = {
        headers: { Authorization: `Bearer ${token}` },
    };
    // Update shop name to test
    const shopId = verifyRes.data.shop._id;
    await Shop_model_1.ShopModel.findByIdAndUpdate(shopId, { shopName: "Test Smoke Shop" });
    // 3. Create a Customer
    console.log("\n3. Creating a customer...");
    const customerRes = await axios_1.default.post(`${BASE_URL}/api/customers`, {
        name: "John Doe",
        phone: "916269880874",
    }, authHeaders);
    if (!customerRes.data.success || !customerRes.data.customer) {
        throw new Error("Customer creation failed");
    }
    const customerId = customerRes.data.customer._id;
    console.log("Customer created successfully with ID:", customerId);
    // 4. Add Credit Transaction
    console.log("\n4. Adding Credit transaction (Rs 100)...");
    const t1Res = await axios_1.default.post(`${BASE_URL}/api/transactions`, {
        customerId,
        type: "credit",
        amount: 100,
        note: "Bought groceries",
    }, authHeaders);
    if (!t1Res.data.success || t1Res.data.balance !== 100) {
        throw new Error(`Credit transaction failed. Balance is ${t1Res.data.balance}`);
    }
    console.log("Credit transaction success. Balance is now Rs 100.");
    // 5. Add Payment Transaction
    console.log("\n5. Adding Payment transaction (Rs 30)...");
    const t2Res = await axios_1.default.post(`${BASE_URL}/api/transactions`, {
        customerId,
        type: "payment",
        amount: 30,
        note: "Partial payment",
    }, authHeaders);
    if (!t2Res.data.success || t2Res.data.balance !== 70) {
        throw new Error(`Payment transaction failed. Balance is ${t2Res.data.balance}`);
    }
    console.log("Payment transaction success. Balance is now Rs 70.");
    // 6. Get Customer Details and History
    console.log("\n6. Fetching customer details & transaction history...");
    const detailsRes = await axios_1.default.get(`${BASE_URL}/api/customers/${customerId}`, authHeaders);
    if (!detailsRes.data.success)
        throw new Error("Fetching customer details failed");
    const { customer, transactions } = detailsRes.data;
    console.log("Customer current balance:", customer.currentBalance);
    console.log("Transactions count:", transactions.length);
    if (customer.currentBalance !== 70)
        throw new Error("Balance mismatch in details");
    if (transactions.length !== 2)
        throw new Error("Transaction history length mismatch");
    // 7. Get Dashboard Stats
    console.log("\n7. Fetching Dashboard stats...");
    const dashboardRes = await axios_1.default.get(`${BASE_URL}/api/dashboard`, authHeaders);
    if (!dashboardRes.data.success)
        throw new Error("Fetching dashboard stats failed");
    console.log("Dashboard total outstanding:", dashboardRes.data.totalUdhaar);
    console.log("Dashboard top defaulters count:", dashboardRes.data.topDefaulters.length);
    if (dashboardRes.data.totalUdhaar !== 70)
        throw new Error("Total outstanding mismatch on dashboard");
    console.log("\n=== ALL SMOKE TESTS PASSED SUCCESSFULLY! ===");
}
runSmokeTest()
    .then(async () => {
    await mongoose_1.default.disconnect();
    process.exit(0);
})
    .catch(async (error) => {
    console.error("\n=== SMOKE TEST FAILED! ===");
    console.error(error);
    await mongoose_1.default.disconnect();
    process.exit(1);
});
