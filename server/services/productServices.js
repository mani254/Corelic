const Product = require('../schema/productSchema');

class ProductService {

   getMatchStage(query) {
      const { search, title, minPrice, maxPrice, status, vendor, trackInventory, stockAvailable } = query;
      let matchStage = {};


      if (search && search.trim() !== "") {
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

      if (trackInventory != null) {
         matchStage.trackInventory = String(trackInventory).toLowerCase() === "true";
      }
      if (stockAvailable != null && String(stockAvailable).toLowerCase() === "true") {
         matchStage.stock = { $gt: 0 };
      }

      return matchStage;
   }

   async fetchProducts(query) {
      try {
         const { sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = query;

         const fetchingOptions = {
            _id: 1, title: 1, overview: 1, price: 1, comparePrice: 1, gst: 1, sku: 1, status: 1, vendor: 1, images: 1, trackInventory: 1, stock: 1, createdAt: 1
         }

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
                     { $limit: pageSize },
                     {
                        $project: fetchingOptions,
                     }
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
         console.error("Error in product aggregation:", error);
         throw new Error(error.message);
      }
   }

   async addProduct(productData) {
      try {
         const product = await Product.create(productData);
         return product;
      } catch (error) {
         console.error("Error While adding the paroduct", error)
         throw new Error(error.message);
      }
   }

   async checkProductById(id) {
      try {
         return await Product.findById(id);
      } catch (error) {
         console.error("Error checking product by ID:", error);
         throw new Error(error.message);
      }
   }

   async checkMultipleProductsById(ids) {
      try {
         return await Product.find({ _id: { $in: ids } }, { title: 1, _id: 1 });
      } catch (error) {
         console.error("Error checking multiple product IDs:", error);
         throw new Error(error.message);
      }
   }

   async deleteProductById(id) {
      try {
         return await Product.findByIdAndDelete(id);
      } catch (error) {
         console.error("Error deleting product:", error);
         throw new Error(error.message);
      }
   }

   async deleteMultipleProducts(ids) {
      try {
         const validProducts = await this.checkMultipleProductsById(ids);
         const validProductIds = validProducts.map(product => product._id.toString());
         const invalidProductIds = ids.filter(id => !validProductIds.includes(id));

         if (validProductIds.length > 0) {
            await Product.deleteMany({ _id: { $in: validProductIds } });
         }

         return { deletedProducts: validProducts, invalidProducts: invalidProductIds };
      } catch (error) {
         console.error("Error deleting multiple products:", error);
         throw new Error(error.message);
      }
   }

   async updateProductStatus(id, status) {
      try {
         return await Product.findByIdAndUpdate(id, { status }, { new: true }); // Return updated product
      } catch (error) {
         console.error("Error updating product status:", error);
         throw new Error(error.message);
      }
   }

   async changeMultipleProductStatus(ids, status) {
      try {
         const validProducts = await this.checkMultipleProductsById(ids);
         const validProductIds = validProducts.map(product => product._id.toString());
         const invalidProductIds = ids.filter(id => !validProductIds.includes(id));

         if (validProductIds.length > 0) {
            await Product.updateMany({ _id: { $in: validProductIds } }, { status });
         }

         return { updatedProducts: validProducts, invalidProducts: invalidProductIds };
      } catch (error) {
         console.error("Error updating multiple product statuses:", error);
         throw new Error(error.message);
      }
   }
}

module.exports = new ProductService();