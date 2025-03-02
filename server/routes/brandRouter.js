const express = require('express')
const brandsController = require('../controllers/brandController')
const router = express.Router()

router.get('/', brandsController.fetchBrands)
router.post('/', brandsController.addBrand)


router.delete('/:id', brandsController.deleteBrand)
router.delete('/', brandsController.deleteMultipleBrands)


module.exports = router