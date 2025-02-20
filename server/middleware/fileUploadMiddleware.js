const multer = require('multer');
const fs = require('fs');
const path = require('path');

const createFileUploadMiddleware = (options) => {
   const { storagePath, fileSize, single, fieldName, allowedTypes } = options;

   // Ensure the directory exists, if not, create it
   if (!fs.existsSync(storagePath)) {
      fs.mkdirSync(storagePath, { recursive: true });
   }

   const storage = multer.diskStorage({
      destination: (req, file, cb) => {
         cb(null, storagePath);
      },
      filename: (req, file, cb) => {
         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
         cb(null, uniqueSuffix + '-' + file.originalname);
      },
   });

   const fileFilter = (req, file, cb) => {
      if (allowedTypes && allowedTypes.length > 0) {
         const mimeType = file.mimetype;
         if (!allowedTypes.includes(mimeType)) {
            return cb(new Error(`Invalid file type. Allowed types are: ${allowedTypes.join(', ')}`), false);
         }
      }
      cb(null, true);
   };

   const upload = multer({
      storage: storage,
      limits: { fileSize },
      fileFilter: fileFilter,
   });

   return single ? upload.single(fieldName) : upload.array(fieldName);
};

module.exports = createFileUploadMiddleware;
