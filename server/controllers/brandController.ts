import { Request, Response } from 'express';
import brandServices from '../services/brandServices';
import { BrandQueryParams, BrandType } from '../types/brandTypes';

 
  export const fetchBrands= async (req: Request<{}, {}, {}, BrandQueryParams>, res: Response)=> {
    try {
      const { sortBy, sortOrder} = req.query;

      console.log(req.query)

      const allowedSortFields = ['createdAt', 'title'];
      if (sortBy && !allowedSortFields.includes(sortBy)) {
        res.status(400).json({ message: "Invalid sort field. Allowed fields: createdAt, title" });
      }

      if (sortOrder && !['asc', 'desc'].includes(sortOrder)) {
        res.status(400).json({ message: "Invalid sort order. Allowed values: asc, desc." });
      }

      const data = await brandServices.fetchBrands(req.query);

      res.status(200).json({ 
        message: 'Brands fetched successfully', 
        brands: data.brands, 
        totalItems: data.totalItems 
      });

    } catch (err: any) {
      console.error('Error while fetching brands', err);
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  }

  export const addBrand= async (req: Request<{}, {}, Partial<BrandType>>, res: Response)=>{
    try {
      const brandData = req.body;

      if (!brandData.title) {
        res.status(400).json({ message: "Title is required" });
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
  }

  export const deleteBrand= async (req: Request<{ id: string }>, res: Response)=> {
    try {
      const { id } = req.params;

      const brand = await brandServices.checkBrandById(id);
      if (!brand) {
        res.status(404).json({ message: "Brand does not exist" });
      }

      const delBrand = await brandServices.deleteBrandById(id);
      if (!delBrand) {
        res.status(404).json({ message: "Failed to delete brand" });
      }

      res.status(200).json({ message: "Brand deleted successfully", brand: delBrand });
    } catch (err: any) {
      console.error("Error deleting brand:", err);
      res.status(500).json({ message: err.message });
    }
  }

  export const deleteMultipleBrands = async (req: Request<{}, {}, { ids: string[] }>, res: Response)=> {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        res.status(400).json({ message: "Invalid request. Provide an array of brand IDs." });
      }

      const { deletedBrands, invalidBrands } = await brandServices.deleteMultipleBrandsById(ids);

      res.status(207).json({
        message: "Brand deletion process completed.",
        brands: deletedBrands,
        invalidBrands
      });

    } catch (err: any) {
      console.error("Error deleting multiple brands:", err);
      res.status(500).json({ message: err.message });
    }
  }
  

