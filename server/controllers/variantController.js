const variantServices = require('../services/variantServices');

const variantController = {
   async fetchVariants(req, res) {
      try {
         const { page = 1, limit = 10 } = req.query;

         const pageNumber = parseInt(page, 10);
         const pageSize = parseInt(limit, 10);

         if (isNaN(pageNumber) || isNaN(pageSize) || pageSize < 1) {
            return res.status(400).json({ message: "Page and limit must be valid positive numbers." });
         }

         const data = await variantServices.fetchVariants(req.query);
         return res.status(200).json({ message: 'Variants fetched successfully', variants: data.variants, totalItems: data.totalItems });

      } catch (err) {
         console.error('Error while fetching variants:', err);
         return res.status(500).json({ message: 'Internal server error', error: err.message });
      }
   },

   async addVariant(req, res) {
      try {
         const products = req.body;

         if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "At least one product must be provided." });
         }

         const newVariant = await variantServices.addVariant(products);

         res.status(201).json({ message: "Variant added successfully", variant: newVariant });
      } catch (err) {
         console.error("Error adding variant:", err);
         res.status(500).json({ message: "Internal server error", error: err.message });
      }
   },

   async fetchVariant(req, res) {
      try {
         const { id } = req.params;

         const variant = await variantServices.fetchVariantById(id);

         if (!variant) {
            return res.status(404).json({ message: "Variant does not exist" });
         }

         res.status(200).json({ message: "Variant fetched successfully", variant });
      } catch (err) {
         console.error("Error fetching Variant:", err);
         res.status(500).json({ message: "Internal server error", error: err.message });
      }
   },

   async deleteVariant(req, res) {
      try {
         const { id } = req.params;
         const delVariant = await variantServices.deleteVariantById(id);

         if (!delVariant) {
            return res.status(404).json({ message: "Variant not found" });
         }

         res.status(200).json({ message: "Variant deleted successfully", variant: delVariant });
      } catch (err) {
         console.error("Error deleting variant:", err);
         res.status(500).json({ message: "Internal server error", error: err.message });
      }
   },

   async deleteMultipleVariants(req, res) {
      try {
         const { ids } = req.body;

         if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "Invalid request. Provide an array of variant IDs." });
         }

         const { deletedVariants, invalidVariants } = await variantServices.deleteMultipleVariantsById(ids);

         res.status(207).json({
            message: "Variants deletion process completed.",
            deletedVariants,
            invalidVariants
         });

      } catch (err) {
         console.error("Error deleting multiple variants:", err);
         res.status(500).json({ message: "Internal server error", error: err.message });
      }
   }

};

module.exports = variantController;
