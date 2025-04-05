import express, { Router } from 'express';
import brandsController from '../controllers/brandController';

const router: Router = express.Router();

router.get('/', brandsController.fetchBrands);
router.post('/', brandsController.addBrand);

router.delete('/:id', brandsController.deleteBrand);
router.delete('/', brandsController.deleteMultipleBrands);

export default router;
