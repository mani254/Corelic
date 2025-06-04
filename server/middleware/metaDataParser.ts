import { NextFunction, Request, Response } from "express";

/**
 * Middleware: transformMetaData
 *
 * Purpose:
 * This middleware transforms flat `metaTitle` and `metaDescription` fields
 * from the request body into a nested `metaData` object. This is useful for
 * maintaining a consistent schema in the database or API responses where SEO
 * metadata is stored as a single object.
 *
 * Example:
 * Incoming Request Body:
 * {
 *   "title": "Brand X",
 *   "metaTitle": "Buy Brand X Online",
 *   "metaDescription": "Best deals on Brand X products"
 * }
 *
 * After transformation:
 * {
 *   "title": "Brand X",
 *   "metaData": {
 *     "metaTitle": "Buy Brand X Online",
 *     "metaDescription": "Best deals on Brand X products"
 *   }
 * }
 *
 * This helps simplify downstream handling of metadata,
 * and avoids scattering related fields throughout the object.
 */

const transformMetaData = (req: Request, res: Response, next: NextFunction) => {
  const { metaTitle, metaDescription } = req.body;

  if (metaTitle || metaDescription) {
    req.body.metaData = {
      metaTitle: metaTitle ?? "",
      metaDescription: metaDescription ?? "",
    };

    delete req.body.metaTitle;
    delete req.body.metaDescription;
  }

  next();
};

export default transformMetaData;
