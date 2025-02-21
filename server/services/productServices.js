const Product = require('../schema/productSchema');

class ProductService {
   async addProduct(productData) {
      try {
         const product = await Product.create(productData);
         return product;
      } catch (error) {
         throw new Error(error.message);
      }
   }

   getMatchStage(query) {
      const { search, title, minPrice, maxPrice, status, vendor, trackInventory, stockAvailable } = query;
      let matchStage = {};


      if (search) {
         matchStage.$or = [
            { title: { $regex: search, $options: 'i' } },
            { overview: { $regex: search, $options: 'i' } }
         ];
      }

      if (title) {
         matchStage.title = { $regex: title, $options: 'i' }
      }

      if (minPrice || maxPrice) {
         matchStage.price = {};
         if (minPrice) matchStage.price.$gte = parseFloat(minPrice);
         if (maxPrice) matchStage.price.$lte = parseFloat(maxPrice);
      }

      if (status) matchStage.status = status;
      if (vendor) matchStage.vendor = vendor;
      if (trackInventory !== undefined) matchStage.trackInventory = trackInventory === 'true';
      if (stockAvailable !== undefined) matchStage.stock = { $gt: 0 };

      return matchStage;
   }

   async fetchProducts(query) {
      try {
         const { sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = query;

         const pageNumber = parseInt(page, 10) || 1;
         const pageSize = parseInt(limit, 10) || 10;
         const skip = (pageNumber - 1) * pageSize;

         const matchStage = this.getMatchStage(query);

         const pipeline = [
            { $match: matchStage },
            {
               $facet: {
                  totalItems: [{ $count: 'count' }],
                  products: [
                     { $sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 } },
                     { $skip: skip },
                     { $limit: pageSize }
                  ]
               }
            },
            {
               $project: {
                  totalItems: { $arrayElemAt: ['$totalItems.count', 0] },
                  products: 1
               }
            }
         ];

         const result = await Product.aggregate(pipeline);
         if (!result[0].totalItems) {
            return { totalItems: 0, products: [] };
         }
         return result[0] || { totalItems: 0, products: [] };
      } catch (error) {
         throw new Error(error.message);
      }
   }
}

module.exports = new ProductService();