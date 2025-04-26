import express, { Router } from 'express';
import { addBrand, deleteBrand, deleteMultipleBrands, fetchBrands, updateBrand } from '../controllers/brandController';

import { NextFunction, Request, Response } from "express";
import { bulkUploadBrands } from '../controllers/brandController';
import fileUpload from '../middleware/fileUpload';
import handleImage from '../middleware/handleImages';
import transformMetaData from '../middleware/metaDataParser';
import brandServices from '../services/brandServices';

const router: Router = express.Router();

interface CustomRequest extends Request{
   title?: string;
}

const handleTitleBeforeImage = async (req:CustomRequest , res:Response, next:NextFunction): Promise<void> => {
  try {
    const {title}=req.body
    const { id } = req.params;

    if(title){
      const brand = await brandServices.checkForTitleDuplication(title,id)
      if(brand){
        res.status(409).send({message:"title already exist"})
        return
      }
    }

    const brand = await brandServices.checkBrandById(id);
    if (!brand) {
      res.status(404).json({ message: "Brand not found" });
      return
    }
    req.title = brand.title;
    next();
  } catch (err: any) {
    console.error("Error in setTitleInHeader middleware:", err);
    res.status(500).json({ message: err.message });
  }
};

router.get('/', fetchBrands);

router.post('/', fileUpload({fieldName:'image'}),handleImage('brand'),transformMetaData,addBrand);

router.post('/bulkupload',bulkUploadBrands)

router.patch(
  "/:id",
  handleTitleBeforeImage,
  fileUpload({ fieldName: "image" }),
  handleImage("brand"), 
  transformMetaData,
  updateBrand
);

router.delete('/:id', deleteBrand);

router.delete('/', deleteMultipleBrands);




export default router;


