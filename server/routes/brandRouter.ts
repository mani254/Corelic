import express, { RequestHandler, Router } from 'express';
import { addBrand, deleteBrand, deleteMultipleBrands, fetchBrands } from '../controllers/brandController';

const router: Router = express.Router();

router.get('/', fetchBrands as RequestHandler);
router.post('/', addBrand);

router.delete('/:id', deleteBrand);
router.delete('/', deleteMultipleBrands);

export default router;
