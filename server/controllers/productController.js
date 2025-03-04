const productService = require('../services/productServices');

const productController = {

   async fetchProducts(req, res) {
      try {
         const { sortBy, sortOrder, page = 1, limit = 10, minPrice, maxPrice } = req.query;

         // Validation for sorting field
         const allowedSortFields = ['createdAt', 'price', 'title', 'stock'];
         if (sortBy && !allowedSortFields.includes(sortBy)) {
            return res.status(400).json({ message: "Invalid sort field. Allowed fields: createdAt, price, title, stock." });
         }

         // Validation for sorting order
         if (sortOrder && !['asc', 'desc'].includes(sortOrder)) {
            return res.status(400).json({ message: "Invalid sort order. Allowed values: asc, desc." });
         }

         // Pagination validation
         const pageNumber = parseInt(page, 10);
         const pageSize = parseInt(limit, 10);
         if (isNaN(pageNumber) || pageNumber < 1 || isNaN(pageSize) || pageSize < 1) {
            return res.status(400).json({ message: "Page and limit must be valid positive numbers." });
         }

         // Price range validation
         if ((minPrice && isNaN(parseFloat(minPrice))) || (maxPrice && isNaN(parseFloat(maxPrice)))) {
            return res.status(400).json({ message: "MinPrice and MaxPrice should be valid numbers." });
         }

         const data = await productService.fetchProducts(req.query);
         res.status(200).json({ message: "Products fetched successfully", products: data.products, totalItems: data.totalItems });
      } catch (err) {
         console.error("Error fetching products:", err);
         res.status(500).json({ message: "Internal server error", error: err.message });
      }
   },

   async addProduct(req, res) {
      try {
         const productData = req.body;

         // Handle missing image uploads
         if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "At least one image must be uploaded" });
         }

         // Map images to proper format
         const images = req.files.map(image => ({ path: image.path, alt: productData.title }));
         productData.images = images;

         // Call service to add product
         const newProduct = await productService.addProduct(productData);

         res.status(201).json({ message: "Product added successfully", product: newProduct });
      } catch (error) {
         console.error("Error adding product:", error);
         res.status(500).json({ message: "Internal server error", error: error.message });
      }
   },

   async deleteProduct(req, res) {
      try {
         const { id } = req.params;

         // Check if the product exists
         const product = await productService.checkProductById(id);
         if (!product) {
            return res.status(404).json({ message: "Product does not exist" });
         }

         // Delete the product
         const delProduct = await productService.deleteProductById(id);

         res.status(204).json({ message: "Product deleted successfull", product: delProduct });
      } catch (err) {
         console.error("Error deleting product:", err);
         res.status(500).json({ message: err.message });
      }
   },

   async deleteMultipleProducts(req, res) {
      try {
         const { ids } = req.body;

         if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "Invalid request. Provide an array of product IDs." });
         }

         const { deletedProducts, invalidProducts } = await productService.deleteMultipleProducts(ids);

         res.status(207).json({
            message: "Products deletion process completed.",
            deletedProducts,
            invalidProducts
         });

      } catch (err) {
         console.error("Error deleting multiple products:", err);
         res.status(500).json({ message: err.message });
      }
   },

   async changeProductStatus(req, res) {
      try {
         const { id } = req.params;
         const { status } = req.body;

         // Check if product exists
         const product = await productService.checkProductById(id);
         if (!product) {
            return res.status(404).json({ message: "Product does not exist" });
         }

         // Update product status
         const updatedProduct = await productService.updateProductStatus(id, status);
         return res.status(200).json({
            message: "Product status updated successfully",
            product: updatedProduct
         });

      } catch (err) {
         console.error("Error updating product status:", err);
         res.status(500).json({ message: err.message });
      }
   },

   async changeMultipleProductStatus(req, res) {
      try {
         const { ids, status } = req.body;

         if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "Invalid request. Provide an array of product IDs." });
         }

         const { updatedProducts, invalidProducts } = await productService.changeMultipleProductStatus(ids, status);

         res.status(207).json({
            message: "Products status update completed.",
            updatedProducts,
            invalidProducts
         });

      } catch (err) {
         console.error("Error updating multiple product statuses:", err);
         res.status(500).json({ message: err.message });
      }
   }

};

module.exports = productController;
