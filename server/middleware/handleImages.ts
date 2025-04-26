import { NextFunction, Request, Response } from "express";
import slugify from "slugify";
import { renameImage, uploadSingleImage } from "../utils/cloudinary";

interface CustomRequest extends Request {
  userName?: string;
  title?: string;
}


const genereateSlug = (name:string)=>{
  return slugify(name, { lower: true });
}


const handleImage = (itemType: string) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const { title } = req.body;
      const name = title || req.title;

      const slug = genereateSlug(name)
      let userName = req.userName || "corelic";
      let folder = `${userName}/${itemType}`;

      // Case 1: Single file upload (req.file)
      if (req.file) {
        const result = await uploadSingleImage(req.file.buffer, folder, slug);

        req.body.image = {
          url: result.secure_url,
          alt: `${slug}-logo`,
          publicId: result.public_id,
        };
      }
      // case 2: when only title is comming from the body and already product is there and and image is not passing only title is updating in this case then update the productid and storage file in the coudinary
      else if (title && !req.body.image && req.title && title!==req.title) {

        const oldPublicId=folder+"/"+genereateSlug(req.title)
        const newPublicId=folder+"/"+genereateSlug(name)

        const result = await renameImage(oldPublicId,newPublicId);
         req.body.image = {
          url: result.secure_url,
          alt: `${slug}-logo`,
          publicId: result.public_id,
        };
      }

      // Case 3: Existing image URLs from body (skip upload)
      else if (req.body.image && typeof req.body.image === "string") {
        req.body.image = {
          url: req.body.image,
          alt: `${slug}-logo`,
          publicId: null,
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
