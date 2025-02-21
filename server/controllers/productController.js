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
   }
};

module.exports = productController;
