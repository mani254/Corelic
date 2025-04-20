import { Request, Response } from "express";
import slugify from "slugify";
import Brand from "../schema/brandSchema";
import brandServices from "../services/brandServices";
import { BrandInput, BrandQueryParams, BrandType } from "../types/brandTypes";
import { bulkUpsertHandler, normalizeBulkData } from "../utils/bulkUpload";
import { deleteImage, uploadSingleImage } from "../utils/cloudinary";

interface BulkUploadRequest<T> {
  data: T[];
  uniqueField: keyof T;
}

export const fetchBrands = async (
  req: Request<{}, {}, {}, BrandQueryParams>,
  res: Response
) => {
  try {
    const { sortBy, sortOrder } = req.query;

    const allowedSortFields = ["createdAt", "title"];
    if (sortBy && !allowedSortFields.includes(sortBy)) {
      res.status(400).json({
        message: "Invalid sort field. Allowed fields: createdAt, title",
      });
      return;
    }

    if (sortOrder && !["asc", "desc"].includes(sortOrder)) {
      res
        .status(400)
        .json({ message: "Invalid sort order. Allowed values: asc, desc." });
      return;
    }

    const data = await brandServices.fetchBrands(req.query);

    res.status(200).json({
      message: "Brands fetched successfully",
      brands: data.brands,
      totalItems: data.totalItems,
    });
  } catch (err: any) {
    console.error("Error while fetching brands", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

export const addBrand = async (
  req: Request<{}, {}, Partial<BrandInput>>,
  res: Response
) => {
  try {
    const { title, image } = req.body;
    if (!title) {
      res.status(400).send({ message: "brand title is required" });
      return;
    }

    let imageUrl = undefined;
    let publicId ="" 
    if (req.file) {
      const fileBuffer = req.file.buffer;
      const originalName = req.file.originalname;
      publicId = `${new Date().getTime()}-brand-${slugify(title)}`
      const result = await uploadSingleImage(fileBuffer, originalName, {
        folder: "corelic/brands",
        publicId
      });
      imageUrl = result.secure_url;
    } else if (image) {
      imageUrl = image;
    }

    req.body.image = {
      url: imageUrl,
      alt: `${slugify(title)}-brand logo`,
      publicId,
    };

    const brandData = req.body;
    const newBrand = await brandServices.addBrand(brandData);
    res
      .status(201)
      .json({ message: "Brand added successfully", brand: newBrand });
  } catch (error: any) {
    console.error("Error adding brand:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const deleteBrand = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const brand = await brandServices.checkBrandById(id);
    if (!brand) {
      res.status(404).json({ message: "Brand does not exist" });
      return;
    }

    const delBrand = await brandServices.deleteBrandById(id);

    const publicId = brand.image?.publicId;
    if (publicId) {
      deleteImage('corelic/brands',publicId);
    }
    
    if (!delBrand) {
      res
        .status(404)
        .json({
          message: "Failed to delete brand",
          deletedBrand: null,
          invalidBrand: id,
        });
      return;
    }

    res
      .status(200)
      .json({
        message: "Brand deleted successfully",
        deletedBrand: delBrand._id,
        invalidBrand: null,
      });
  } catch (err: any) {
    console.error("Error deleting brand:", err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteMultipleBrands = async (
  req: Request<{}, {}, { ids: string[] }>,
  res: Response
) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      res
        .status(400)
        .json({ message: "Invalid request. Provide an array of brand IDs." });
      return;
    }

    const { deletedBrands, invalidBrands } =
      await brandServices.deleteMultipleBrandsById(ids);

    if (!deletedBrands) {
      res
        .status(404)
        .send({
          message: "Brands doesn't exist",
          invalidBrands: ids,
          deleteBrands: null,
        });
      return;
    }

    if(deletedBrands.length>=1){
      deletedBrands.forEach((brand)=>{
        const publicId = brand.image?.publicId;
        if (publicId) {
          deleteImage('corelic/brands',publicId);
        }
      })
    }

    res.status(207).json({
      message: "Brand deletion process completed.",
      deletedBrands: deletedBrands.map(brand=>brand._id),
      invalidBrands: invalidBrands,
    });

  } catch (err: any) {
    console.error("Error deleting multiple brands:", err);
    res.status(500).json({ message: err.message });
  }
};

export const bulkUploadBrands = async (
  req: Request<{}, {}, BulkUploadRequest<BrandInput>>,
  res: Response
) => {
  try {
    const { data, uniqueField } = req.body;

    const normalizedData = normalizeBulkData(data); 

    const result = await bulkUpsertHandler<BrandType>(Brand, normalizedData, uniqueField);

    res.status(200).json({
      message: "Bulk operation completed",
      ...result,
    });
  } catch (err: any) {
    console.error("Bulk upload error:", err);
    res.status(500).json({ message: err.message });
  }
};

