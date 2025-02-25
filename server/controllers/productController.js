const productService = require('../services/productServices');

const productController = {

   async addProduct(req, res) {
      try {
         const product = req.body

         if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files were uploaded" });
         }
         const images = req.files.map(image => ({ path: image.path, alt: product.title }))

         product.options = JSON.parse(product.options)
         product.metaData = JSON.parse(product.metaData)
         product.images = images


         const data = await productService.addProduct(product)
         res.status(201).json(data);
      } catch (err) {
         console.log(err)
         res.status(500).json({ message: err.message });
      }
   },

   async fetchProducts(req, res) {
      try {
         const data = await productService.fetchProducts(req.query)
         res.status(201).json(data);
      }
      catch (err) {
         console.log(err)
         res.status(500).json({ message: err.message })
      }
   },

   async deleteProduct(req, res) {
      try {
         const { id } = req.params;

         // Check if the product exists
         const isProductExist = await productService.checkProductById(id);
         if (!isProductExist) {
            return res.status(404).json({ message: "Product does not exist" });
         }

         // Delete the product
         const deletedProduct = await productService.deleteProductById(id);
         if (!deletedProduct) {
            return res.status(500).json({ message: "Failed to delete product" });
         }

         res.status(200).json({
            message: "Product deleted successfully",
            product: deletedProduct,
         });

      } catch (err) {
         console.log(err);
         res.status(500).json({ message: err.message });
      }
   },

   async deleteMultipleProducts(req, res) {
      try {
         const { ids } = req.body;


         if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "Invalid request. Provide an array of product IDs." });
         }

         const { products, invalidProducts } = await productService.deleteMultipleProducts(ids);

         res.status(200).json({
            message: "Products deletion process completed.",
            products,
            invalidProducts
         });

      } catch (err) {
         console.error(err);
         res.status(500).json({ message: err.message });
      }
   },

   async changeProductStatus(req, res) {
      try {
         const { id } = req.params;
         const { status } = req.body

         const isProductExist = await productService.checkProductById(id)
         if (!isProductExist) {
            return res.status(404).json({ message: "Product does not exist" });
         }

         const updateProduct = await productService.updateProductStatus(id, status)
         return res.status(200).json({ product: updateProduct, message: 'Product status update succesfull' })

      } catch (err) {
         console.error(err)
         res.status(500).json({ message: err.message })
      }
   },

   async changeMultipleProductStatus(req, res) {
      try {
         const { ids, status } = req.body;

         if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "Invalid request. Provide an array of product IDs." });
         }

         const { products, invalidProducts } = await productService.changeMultipleProductStatus(ids, status)

         res.status(200).json({
            message: "Products Status updated succesfully",
            products,
            invalidProducts
         });


      } catch (err) {
         console.error(err)
         res.status(500).json({ message: err.message })
      }
   }

};

module.exports = productController;
