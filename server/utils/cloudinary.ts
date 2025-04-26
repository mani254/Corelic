import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import dotenv from 'dotenv';
import streamifier from 'streamifier';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

interface UploadOptions {
  folder: string;
  publicId?: string; // Optional
}

export const uploadSingleImage = (
  fileBuffer: Buffer,
  folder: string,
  publicId: string,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
        format: "webp",
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) return reject(error);
        resolve(result!);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

export const deleteImage = (publicId: string): Promise<any> => {

  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      { resource_type: 'image' },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Deletion Error:', error);
          return reject(error);
        }
        console.log('Cloudinary Deletion Result:', result);
        resolve(result);
      }
    );
  });
};

export const renameImage = (
  oldPublicId: string,
  newPublicId: string
): Promise<UploadApiResponse> => {
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
