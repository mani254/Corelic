import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary";
import dotenv from "dotenv";
import streamifier from "streamifier";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

// Helper: Extract public_id from a full Cloudinary URL
const extractPublicIdFromUrl = (url: string): string => {
  const parts = url.split("/");
  const last = parts.pop()!;
  const publicId = last.split(".")[0];
  return [...parts.slice(parts.indexOf("upload") + 1), publicId].join("/");
};

export const uploadSingleImage = (
  fileBuffer: Buffer,
  folder: string
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        format: "webp",
      },
      (
        error: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined
      ) => {
        if (error) return reject(error);
        resolve(result!);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

export const deleteImage = (imageUrl: string): Promise<any> => {
  if (imageUrl.includes("imagePlaceholder") || imageUrl.includes("placeholder"))
    return Promise.resolve();

  const publicId = extractPublicIdFromUrl(imageUrl);
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      { resource_type: "image" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Deletion Error:", error);
          return reject(error);
        }
        console.log("Cloudinary Deletion Result:", result);
        resolve(result);
      }
    );
  });
};

export const renameImage = (
  imageUrl: string,
  newName: string
): Promise<UploadApiResponse> => {
  const oldPublicId = extractPublicIdFromUrl(imageUrl);
  const folder = oldPublicId.includes("/")
    ? oldPublicId.split("/").slice(0, -1).join("/")
    : "";
  const newPublicId = folder ? `${folder}/${newName}` : newName;

  return new Promise((resolve, reject) => {
    cloudinary.uploader.rename(
      oldPublicId,
      newPublicId,
      {
        overwrite: true,
        invalidate: true,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Rename Error:", error);
          return reject(error);
        }
        console.log("Cloudinary Rename Result:", result);
        resolve(result as UploadApiResponse);
      }
    );
  });
};

export default cloudinary;
