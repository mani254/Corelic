const express = require('express');
const router = express.Router();
const variantController = require('../controllers/variantController');

router.get('/', variantController.fetchVariants);
router.get('/:id', variantController.fetchVariant);
router.post('/', variantController.addVariant);
router.delete('/:id', variantController.deleteVariant);
router.delete('/', variantController.deleteMultipleVariants);

module.exports = router;