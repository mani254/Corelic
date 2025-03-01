const express = require('express')
const collectionsController = require('../controllers/collectionController')
const validateCollection = require('../middleware/validateCollection')
const createFileUploadMiddleware = require('../middleware/fileUploadMiddleware')
const router = express.Router()

const uploadCollectionImage = createFileUploadMiddleware({
   storagePath: "./public/uploads/collections",
   fileSize: 3 * 1024 * 1024,
   single: true,
   fieldName: "image",
   allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
});

router.get('/', collectionsController.fetchCollections)
router.post('/', uploadCollectionImage, validateCollection, collectionsController.addCollection)

router.delete('/:id', collectionsController.deleteCollection)
router.delete('/', collectionsController.deleteMultipleCollections)

router.put('/status/:id', collectionsController.changeCollectionStatus)
router.put('/status', collectionsController.changeMultipleCollectionStatus)


module.exports = router