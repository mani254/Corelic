const brandServices = require("../services/brandServices");

const brandsController = {
   async fetchBrands(req, res) {
      try {
         const { sortBy = "createdAt", sortOrder = "desc", page = 1, limit = 10 } = req.query;

         const allowedSortFields = ['createdAt', 'title'];
         if (sortBy && !allowedSortFields.includes(sortBy)) {
            return res.status(400).json({ message: "Invalid sort field. Allowed fields: createdAt, title" });
         }

         if (sortOrder && !['asc', 'desc'].includes(sortOrder)) {
            return res.status(400).json({ message: "Invalid sort order. Allowed values: asc, desc." });
         }

         const pageNumber = parseInt(page, 10);
         const pageSize = parseInt(limit, 10);
         if (isNaN(pageNumber) || isNaN(pageSize) || pageSize < 1) {
            return res.status(400).json({ message: "Page and limit must be valid positive numbers." });
         }

         const data = await brandServices.fetchBrands(req.query);

         return res.status(200).json({ message: 'Brands fetched successfully', brands: data.brands, totalItems: data.totalItems });

      } catch (err) {
         console.error('Error while fetching brands', err);
         return res.status(500).json({ message: 'Internal server error', error: err.message });
      }
   },

   async addBrand(req, res) {
      try {
         const brandData = req.body;

         console.log(brandData, '---------------')
         brandData.metaData = {
            metaTitle: brandData.metaTitle,
            metaDescription: brandData.metaDescription
         }

         const newBrand = await brandServices.addBrand(brandData);

         res.status(201).json({ message: 'Brand added successfully', brand: newBrand });

      } catch (error) {
         console.error("Error adding brand:", error);
         res.status(500).json({ message: "Internal server error", error: error.message });
      }
   },

   async deleteBrand(req, res) {
      try {
         const { id } = req.params;

         const brand = await brandServices.checkBrandById(id);
         if (!brand) {
            return res.status(404).json({ message: "Brand does not exist" });
         }

         const delBrand = await brandServices.deleteBrandById(id);
         res.status(204).json({ message: "Brand deleted successfully", brand: delBrand });
      } catch (err) {
         console.error("Error deleting brand:", err);
         res.status(500).json({ message: err.message });
      }
   },

   async deleteMultipleBrands(req, res) {
      try {
         const { ids } = req.body;

         if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "Invalid request. Provide an array of brand IDs." });
         }

         const { deletedBrands, invalidBrands } = await brandServices.deleteMultipleBrandsById(ids);

         res.status(207).json({
            message: "Brand deletion process completed.",
            brands: deletedBrands,
            invalidBrands
         });

      } catch (err) {
         console.error("Error deleting multiple brands:", err);
         res.status(500).json({ message: err.message });
      }
   }
};

module.exports = brandsController;
