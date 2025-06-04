import multer from "multer";
import path = require("path");

export interface fileUploadOptions {
  fieldName: string;
  single?: boolean;
  fileSizeLimit?: number;
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
}

const fileUpload = (options: fileUploadOptions) => {
  const {
    fieldName,
    single = true,
    fileSizeLimit = 2 * 1024 * 1024,
    allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"],
    allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"],
  } = options;

  const storage = multer.memoryStorage();

  const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
    const mimeType = file.mimetype;
    const ext = path.extname(file.originalname).toLowerCase();

    const isMimeTypeValid =
      allowedMimeTypes.length === 0 || allowedMimeTypes.includes(mimeType);
    const isExtensionValid =
      allowedExtensions.length === 0 || allowedExtensions.includes(ext);

    if (!isMimeTypeValid || !isExtensionValid) {
      const error = new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        `Invalid file type. Allowed: ${allowedExtensions.join(", ")}`
      );
      return cb(error);
    }

    cb(null, true);
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: fileSizeLimit },
  });

  return single ? upload.single(fieldName) : upload.array(fieldName);
};

export default fileUpload;
