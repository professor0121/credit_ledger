"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const cloudinary_1 = require("cloudinary");
const env_1 = require("../config/env");
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
    async uploadImage(filePath, shopId, subfolder) {
        if (this.isMock) {
            console.log(`[MOCK CLOUDINARY] Uploading file from path "${filePath}" to folder "udhaar-app/${shopId}/${subfolder}"`);
            return `https://res.cloudinary.com/mock-cloud/image/upload/v12345/udhaar-app/${shopId}/${subfolder}/mock-image.jpg`;
        }
        const result = await cloudinary_1.v2.uploader.upload(filePath, {
            folder: `udhaar-app/${shopId}/${subfolder}`,
            resource_type: "image",
        });
        return result.secure_url;
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
