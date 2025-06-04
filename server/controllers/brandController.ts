import { Request, Response } from "express";
import Brand from "../schema/brandSchema";
import brandServices from "../services/brandServices";
import { BrandInput, BrandQueryParams, BrandType } from "../types/brandTypes";
import { bulkUpsertHandler, normalizeBulkData } from "../utils/bulkUpload";
import { deleteImage } from "../utils/cloudinary";

interface BulkUploadRequest<T> {
  data: T[];
  uniqueField: keyof T;
  uploadType: "add" | "update";
}

export const fetchBrands = async (
  req: Request<{}, {}, {}, BrandQueryParams>,
  res: Response
) => {
  try {
    const { sortBy, orderBy } = req.query;

    const allowedSortFields = ["createdAt", "title"];
    if (sortBy && !allowedSortFields.includes(sortBy)) {
      res.status(400).json({
        message: "Invalid sort field. Allowed fields: createdAt, title",
      });
      return;
    }

    if (orderBy && !["asc", "desc"].includes(orderBy)) {
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
      .json({ message: "error while fetching Brands", error: err.message });
  }
};

export const addBrand = async (
  req: Request<{}, {}, Partial<BrandInput>>,
  res: Response
) => {
  try {
    const { title } = req.body;

    if (!title) {
      res.status(400).send({ message: "brand title is required" });
      return;
    }

    const brandData = req.body;
    const newBrand = await brandServices.addBrand(brandData);
    res
      .status(201)
      .json({ message: "Brand added successfully", brand: newBrand });
  } catch (error: any) {
    console.error("Error adding brand:", error);
    res
      .status(500)
      .json({ message: "Error While Adding Brand", error: error.message });
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

    const imageUrl = brand.image?.url;
    if (imageUrl) {
      deleteImage(imageUrl);
    }

    if (!delBrand) {
      res.status(404).json({
        message: "Failed to delete brand",
        deletedBrand: null,
      });
      return;
    }

    res.status(200).json({
      message: "Brand deleted successfully",
      deletedBrand: delBrand._id,
    });
  } catch (err: any) {
    console.error("Error deleting brand:", err);
    res
      .status(500)
      .json({ message: "Error while deleteing Brand", error: err.message });
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
      res.status(404).send({
        message: "Brands doesn't exist",
        invalidBrands: ids,
        deleteBrands: null,
      });
      return;
    }

    if (deletedBrands.length >= 1) {
      deletedBrands.forEach((brand) => {
        const imageUrl = brand.image?.url;
        if (imageUrl) {
          deleteImage(imageUrl);
        }
      });
    }

    res.status(207).json({
      message: "Brand deletion process completed.",
      deletedBrands: deletedBrands.map((brand) => brand._id),
      invalidBrands: invalidBrands,
    });
  } catch (err: any) {
    console.error("Error deleting multiple brands:", err);
    res
      .status(500)
      .json({ message: "Error deleting multiple brands", error: err.message });
  }
};

export const bulkUploadBrands = async (
  req: Request<{}, {}, BulkUploadRequest<BrandInput>>,
  res: Response
) => {
  try {
    const { data, uniqueField, uploadType } = req.body;

    const normalizedData = normalizeBulkData(data);

    const result = await bulkUpsertHandler<BrandType>(
      Brand,
      normalizedData,
      uniqueField,
      uploadType
    );

    res.status(200).json({
      message: `${result} brands uploaded successfully`,
    });
  } catch (err: any) {
    console.error("Bulk upload error:", err);
    res
      .status(500)
      .json({ message: "Error while bulk uploading", error: err.message });
  }
};

export const updateBrand = async (
  req: Request<{ id: string }, {}, Partial<BrandInput>>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findById(id);
    if (!brand) {
      res.status(404).json({ message: "Brand not found" });
      return;
    }

    const updatedBrand = await brandServices.updateBrand({
      _id: brand._id,
      ...req.body,
    } as BrandType);

    let oldImage = brand?.image?.url;
    let newImage = updatedBrand?.image?.url;

    if (oldImage && newImage && oldImage !== newImage) {
      deleteImage(oldImage);
    }

    res.status(200).json({
      message: "Brand updated successfully",
      brand: updatedBrand,
    });
  } catch (err: any) {
    console.error("Error while updating brand:", err);
    res.status(500).json({ message: err.message });
  }
};
