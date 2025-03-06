const Variant = require('../schema/variantSchema');

class VariantService {

   async fetchVariants(query) {
      try {
         const { page, limit, search } = query;

         const pageNumber = parseInt(page, 10) || 1;
         const pageSize = parseInt(limit, 10) || 10;
         const skip = (pageNumber - 1) * pageSize;

         const pipeline = [
            {
               $lookup: {
                  from: "products",
                  localField: "products",
                  foreignField: "_id",
                  as: "products",
                  pipeline: [
                     {
                        $project: {
                           _id: 1,
                           title: 1,
                           slug: 1,
                           image: { $arrayElemAt: ["$images", 0] },
                           status: 1,
                        }
                     }
                  ]
               }
            },

            ...(search && search.trim()
               ? [{ $match: { "products.title": { $regex: search.trim(), $options: "i" } } }]
               : []),

            {
               $facet: {
                  totalItems: [{ $count: "count" }],
                  variants: [
                     { $skip: skip },
                     { $limit: pageSize },
                     { $project: { _id: 1, products: 1 } }
                  ]
               }
            },

            {
               $project: {
                  totalItems: { $ifNull: [{ $arrayElemAt: ['$totalItems.count', 0] }, 0] },
                  variants: 1
               }
            }
         ];

         const result = await Variant.aggregate(pipeline);
         return {
            totalItems: result[0]?.totalItems || 0,
            variants: result[0]?.variants || []
         };
      } catch (err) {
         console.error("Error in fetchVariants:", err);
         throw new Error("Failed to fetch variants");
      }
   }

   async fetchVariantById(id) {
      try {
         if (!id) {
            throw new Error("Variant ID is required");
         }

         const variant = await Variant.findById(id)
            .populate({
               path: "products",
               select: "_id title slug images",
            })
            .lean();

         if (!variant) {
            throw new Error("Variant not found");
         }

         // Extract the first image from each product
         variant.products = variant.products.map(product => ({
            _id: product._id,
            title: product.title,
            slug: product.slug,
            image: product.images?.[0] || null // Get first image or null if no images
         }));

         return variant;
      } catch (err) {
         console.error("Error in fetchSingleVariantById:", err);
         throw new Error("Failed to fetch variant");
      }
   }

   async deleteVariantById(id) {
      try {
         return await Variant.findByIdAndDelete(id);
      } catch (err) {
         console.error("Error deleting variant:", err);
         throw new Error(err.message);
      }
   }

   async deleteMultipleVariantsById(ids) {
      try {
         const { deletedCount } = await Variant.deleteMany({ _id: { $in: ids } });

         return {
            deletedVariants: deletedCount,
            invalidVariants: ids.length - deletedCount
         };
      } catch (err) {
         console.error("Error deleting multiple variants:", err);
         throw new Error(err.message);
      }
   }

   async checkForProductExistance(products) {
      try {
         return await Variant.findOne({
            products: { $elemMatch: { $in: products } }
         });
      } catch (err) {
         console.error("Error while checking existing variant:", err);
         throw new Error(err.message);
      }
   }

   async addVariant(products) {
      try {
         if (!products || !products.length) {
            throw new Error("At least one product is required to create a variant.");
         }

         const exist = await this.checkForProductExistance(products);
         if (exist) {
            throw new Error("One or more products are already associated with another variant.");
         }

         return await Variant.create({ products });
      } catch (err) {
         console.error("Error while adding variant:", err);
         throw new Error(err.message);
      }
   }

}

module.exports = new VariantService();



// async fetchVariants(query) {
//    try {
//       const { page, limit, search } = query;

//       const pageNumber = parseInt(page, 10) || 1;
//       const pageSize = parseInt(limit, 10) || 10;
//       const skip = (pageNumber - 1) * pageSize;

//       const pipeline = [
//          {
//             $lookup: {
//                from: "products",
//                localField: "products",
//                foreignField: "_id",
//                as: "products"
//             }
//          },

//          ...(search ? [{ $match: { "products.title": { $regex: search, $options: "i" } } }] : []),

//          {
//             $facet: {
//                totalItems: [{ $count: "count" }],
//                variants: [
//                   { $skip: skip },
//                   { $limit: pageSize },
//                   {
//                      $project: {
//                         _id: 1,
//                         products: {
//                            $map: {
//                               input: "$products",
//                               as: "product",
//                               in: {
//                                  _id: "$$product._id",
//                                  title: "$$product.title",
//                                  slug: "$$product.slug"
//                               }
//                            }
//                         }
//                      }
//                   }
//                ]
//             }
//          },
//          {
//             $project: {
//                totalItems: { $ifNull: [{ $arrayElemAt: ['$totalItems.count', 0] }, 0] },
//                variants: 1
//             }
//          }
//       ];

//       const result = await Variant.aggregate(pipeline);
//       return {
//          totalItems: result[0]?.totalItems || 0,
//          variants: result[0]?.variants || []
//       };
//    } catch (err) {
//       console.error("Error fetching variants:", err);
//       throw new Error("Failed to fetch variants");
//    }
// }