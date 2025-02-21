const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')
const createFileUploadMiddleware = require('../middleware/fileUploadMiddleware')

const uploadProductImages = createFileUploadMiddleware({
   storagePath: "./public/uploads/products",
   fileSize: 5 * 1024 * 1024,
   single: false,
   fieldName: "images",
   allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
});

router.post('/', uploadProductImages, productController.addProduct)
router.get('/', productController.fetchProducts)

module.exports = router