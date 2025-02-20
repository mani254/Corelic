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
}

module.exports = new ProductService();