const Brand = require('../schema/brandSchema');

class BrandService {

   getMatchState(query) {
      const { search } = query;
      let matchStage = {};

      if (search && search.trim() !== "") {
         matchStage.title = { $regex: search, $options: 'i' };
      }

      return matchStage;
   }

   async fetchBrands(query) {
      try {
         const { sortBy = "createdAt", sortOrder = "desc", page = 1, limit = 10 } = query;

         const fetchingOptions = {
            _id: 1,
            title: 1,
            description: 1,
            createdAt: 1,
            updatedAt: 1
         };

         const pageNumber = parseInt(page, 10) || 1;
         const pageSize = parseInt(limit, 10) || 10;
         const skip = (pageNumber - 1) * pageSize;

         const matchStage = this.getMatchState(query);

         const pipeline = [
            { $match: matchStage },
            {
               $facet: {
                  totalItems: [{ $count: 'count' }],
                  brands: [
                     { $sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 } },
                     { $skip: skip },
                     { $limit: pageSize },
                     { $project: fetchingOptions }
                  ]
               }
            },
            {
               $project: {
                  totalItems: { $arrayElemAt: ['$totalItems.count', 0] },
                  brands: 1
               }
            }
         ];

         const result = await Brand.aggregate(pipeline);
         if (!result[0].totalItems) {
            return { totalItems: 0, brands: [] };
         }
         return result[0] || { totalItems: 0, brands: [] };

      } catch (error) {
         console.error('Error while fetching brands:', error);
         throw new Error(error.message);
      }
   }

   async addBrand(brandData) {
      try {
         const newBrand = await Brand.create(brandData);
         return newBrand;
      } catch (error) {
         console.error('Error while adding brand:', error);
         throw new Error(error.message);
      }
   }

   async checkBrandById(id) {
      try {
         return await Brand.findById(id);
      } catch (error) {
         console.error("Error checking brand by ID:", error);
         throw new Error(error.message);
      }
   }

   async checkMultipleBrandsById(ids) {
      try {
         return await Brand.find({ _id: { $in: ids } }, { title: 1, _id: 1 });
      } catch (error) {
         console.error("Error checking multiple brand IDs:", error);
         throw new Error(error.message);
      }
   }

   async deleteBrandById(id) {
      try {
         return await Brand.findByIdAndDelete(id);
      } catch (error) {
         console.error("Error deleting brand:", error);
         throw new Error(error.message);
      }
   }

   async deleteMultipleBrandsById(ids) {
      try {
         const validBrands = await this.checkMultipleBrandsById(ids);
         const validBrandIds = validBrands.map(brand => brand._id.toString());
         const invalidBrandIds = ids.filter(id => !validBrandIds.includes(id));

         if (validBrandIds.length > 0) {
            await Brand.deleteMany({ _id: { $in: validBrandIds } });
         }

         return { deletedBrands: validBrands, invalidBrands: invalidBrandIds };
      } catch (error) {
         console.error("Error deleting multiple brands:", error);
         throw new Error(error.message);
      }
   }
}

module.exports = new BrandService();
