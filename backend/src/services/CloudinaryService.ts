import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { config } from "../config/env";

export class CloudinaryService {
  private readonly isMock: boolean;

  constructor() {
    this.isMock = config.cloudinary.isMock;
    if (!this.isMock) {
      cloudinary.config({
        cloud_name: config.cloudinary.cloudName,
        api_key: config.cloudinary.apiKey,
        api_secret: config.cloudinary.apiSecret,
      });
    }
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
    if (this.isMock) {
      console.log(`[MOCK CLOUDINARY] Uploading file from path "${filePath}" to folder "udhaar-app/${shopId}/${subfolder}"`);
      return `https://res.cloudinary.com/mock-cloud/image/upload/v12345/udhaar-app/${shopId}/${subfolder}/mock-image.jpg`;
    }

    const result: UploadApiResponse = await cloudinary.uploader.upload(filePath, {
      folder: `udhaar-app/${shopId}/${subfolder}`,
      resource_type: "image",
    });
    return result.secure_url;
  }

  async deleteImage(publicId: string): Promise<void> {
    if (this.isMock) {
      console.log(`[MOCK CLOUDINARY] Deleting image with publicId "${publicId}"`);
      return;
    }
    await cloudinary.uploader.destroy(publicId);
  }
}
