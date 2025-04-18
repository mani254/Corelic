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
  originalName: string,
  options: UploadOptions
): Promise<UploadApiResponse> => {
  const { folder, publicId } = options;
  const fileNameWithoutExt = originalName.split('.').slice(0, -1).join('.');
  const finalPublicId = publicId ?? fileNameWithoutExt;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: finalPublicId,
        overwrite: true,
        resource_type: 'image',
        format: 'webp', // 👈 Always convert to webp
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) return reject(error);
        resolve(result as UploadApiResponse);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

export const uploadMultipleImages = async (
  files: Express.Multer.File[],
  folder: string
): Promise<UploadApiResponse[]> => {
  const uploadPromises = files.map((file) => {
    const fileName = file.originalname.split('.').slice(0, -1).join('.');
    return uploadSingleImage(file.buffer, fileName, {
      folder,
      publicId: fileName, // Reuse filename for id
    });
  });

  return Promise.all(uploadPromises);
};

export const deleteImage = (folder:string,publicId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    let pathId= folder +'/'+ publicId
    cloudinary.uploader.destroy(
      pathId,
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


export default cloudinary;
