"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const cloudinary_1 = require("cloudinary");
const env_1 = require("../config/env");
const fs_1 = __importDefault(require("fs"));
class CloudinaryService {
    isMock;
    constructor() {
        this.isMock = env_1.config.cloudinary.isMock;
        if (!this.isMock) {
            cloudinary_1.v2.config({
                cloud_name: env_1.config.cloudinary.cloudName,
                api_key: env_1.config.cloudinary.apiKey,
                api_secret: env_1.config.cloudinary.apiSecret,
            });
        }
    }
    /**
     * Uploads an image into a shop-specific folder.
     * Structure: udhaar-app/{shopId}/customers/{filename}
     *            udhaar-app/{shopId}/shop-logo/{filename}
     */
    async uploadImage(filePath) {
        if (this.isMock) {
            console.log(`[MOCK CLOUDINARY] Uploading file from path "${filePath}"`);
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
            return `https://res.cloudinary.com/mock-cloud/image/upload/v12345/mock-image.jpg`;
        }
        try {
            const result = await cloudinary_1.v2.uploader.upload(filePath, {
                resource_type: "image",
            });
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
            return result.secure_url;
        }
        catch (error) {
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
            throw error;
        }
    }
    async deleteImage(publicId) {
        if (this.isMock) {
            console.log(`[MOCK CLOUDINARY] Deleting image with publicId "${publicId}"`);
            return;
        }
        await cloudinary_1.v2.uploader.destroy(publicId);
    }
}
exports.CloudinaryService = CloudinaryService;
