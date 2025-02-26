const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')
const createFileUploadMiddleware = require('../middleware/fileUploadMiddleware')

const validateProduct = require('../middleware/validateProduct');

const uploadProductImages = createFileUploadMiddleware({
   storagePath: "./public/uploads/products",
   fileSize: 5 * 1024 * 1024,
   single: false,
   fieldName: "images",
   allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
});

router.get('/', productController.fetchProducts)
router.post('/', uploadProductImages, validateProduct, productController.addProduct)

router.delete('/:id', productController.deleteProduct)
router.delete('/', productController.deleteMultipleProducts)

router.put('/status/:id', productController.changeProductStatus)
router.put('/status', productController.changeMultipleProductStatus)

module.exports = router