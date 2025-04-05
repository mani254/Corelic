import { Request, Response } from 'express';
import brandServices from '../services/brandServices';
import { BrandQueryParams, BrandType } from '../types/brandTypes';


const brandsController = {
  async fetchBrands(req: Request<{}, {}, {}, BrandQueryParams>, res: Response) {
    try {
      const { sortBy = "createdAt", sortOrder = "desc", page, limit} = req.query;

      const allowedSortFields = ['createdAt', 'title'];
      if (sortBy && !allowedSortFields.includes(sortBy)) {
        return res.status(400).json({ message: "Invalid sort field. Allowed fields: createdAt, title" });
      }

      if (sortOrder && !['asc', 'desc'].includes(sortOrder)) {
        return res.status(400).json({ message: "Invalid sort order. Allowed values: asc, desc." });
      }

      const pageNumber = Number(page);
      const limitNumber = Number(limit);

      if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1) {
        return res.status(400).json({ message: "Page and limit must be valid positive numbers." });
      }

      // Convert query params to match service expectations
      const serviceQuery = {
        ...req.query,
        page: pageNumber,
        limit: limitNumber
      };

      const data = await brandServices.fetchBrands(serviceQuery);

      return res.status(200).json({ 
        message: 'Brands fetched successfully', 
        brands: data.brands, 
        totalItems: data.totalItems 
      });

    } catch (err: any) {
      console.error('Error while fetching brands', err);
      return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  },

  async addBrand(req: Request<{}, {}, Partial<BrandType>>, res: Response) {
    try {
      const brandData = req.body;

      if (!brandData.title) {
        return res.status(400).json({ message: "Title is required" });
      }
      // Only create metaData if either metaTitle or metaDescription exists
      if (brandData.metaData?.metaTitle || brandData.metaData?.metaDescription) {
        brandData.metaData = {
          metaTitle: brandData.metaData?.metaTitle || '',
          metaDescription: brandData.metaData?.metaDescription || ''
        };
      }

      const newBrand = await brandServices.addBrand(brandData);

      res.status(201).json({ message: 'Brand added successfully', brand: newBrand });

    } catch (error: any) {
      console.error("Error adding brand:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  async deleteBrand(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;

      const brand = await brandServices.checkBrandById(id);
      if (!brand) {
        return res.status(404).json({ message: "Brand does not exist" });
      }

      const delBrand = await brandServices.deleteBrandById(id);
      if (!delBrand) {
        return res.status(404).json({ message: "Failed to delete brand" });
      }

      return res.status(200).json({ message: "Brand deleted successfully", brand: delBrand });
    } catch (err: any) {
      console.error("Error deleting brand:", err);
      return res.status(500).json({ message: err.message });
    }
  },

  async deleteMultipleBrands(req: Request<{}, {}, { ids: string[] }>, res: Response) {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: "Invalid request. Provide an array of brand IDs." });
      }

      const { deletedBrands, invalidBrands } = await brandServices.deleteMultipleBrandsById(ids);

      return res.status(207).json({
        message: "Brand deletion process completed.",
        brands: deletedBrands,
        invalidBrands
      });

    } catch (err: any) {
      console.error("Error deleting multiple brands:", err);
      return res.status(500).json({ message: err.message });
    }
  }
};

export default brandsController;
