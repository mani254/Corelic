import { NextFunction, Request, Response } from "express";
import slugify from "slugify";
import { uploadSingleImage } from "../utils/cloudinary";

interface CustomRequest extends Request {
  username?: string;
  title?: string;
}

const genereateSlug = (name: string) => {
  return slugify(name, { lower: true });
};

const handleImage = (itemType: string) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const { title } = req.body;
      const name = title || req.title;

      const slug = genereateSlug(name);
      let userName = req.username || "corelic";
      let folder = `${userName}/${itemType}`;

      // Case 1: Single file upload (req.file)
      if (req.file) {
        const result = await uploadSingleImage(req.file.buffer, folder);

        req.body.image = {
          url: result.secure_url,
          alt: `${slug}-image`,
        };
      }

      next();
    } catch (err: any) {
      console.error("Image middleware error:", err);
      res.status(500).json({
        message: "Image processing failed",
        error: err.message,
      });
    }
  };
};

export default handleImage;
