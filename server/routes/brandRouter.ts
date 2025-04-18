import express, { Router } from 'express';
import { addBrand, deleteBrand, deleteMultipleBrands, fetchBrands } from '../controllers/brandController';

import fileUpload from '../middleware/fileUpload';
import transformMetaData from '../middleware/metaDataParser';

const router: Router = express.Router();

router.get('/', fetchBrands);

router.post('/', fileUpload({fieldName:'image'}),transformMetaData,addBrand);

router.delete('/:id', deleteBrand);

router.delete('/', deleteMultipleBrands);

export default router;
