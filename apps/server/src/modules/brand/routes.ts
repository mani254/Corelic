import express, { Router } from "express";
import multer from "multer";
import { asyncHandler } from "../../shared/async-handler";
import {
  createBrand,
  deleteBrand,
  fetchBrands,
  getBrandById,
  updateBrand,
} from "./controller";

const router: Router = express.Router();
const upload = multer();

router.get("/", asyncHandler(fetchBrands));
router.get("/:id", asyncHandler(getBrandById));
router.post("/", upload.single("logo"), asyncHandler(createBrand));
router.put("/:id", upload.single("logo"), asyncHandler(updateBrand));
router.delete("/:id", asyncHandler(deleteBrand));

export default router;
