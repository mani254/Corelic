import express, { Router } from "express";
import brandsRouter from "../modules/brand/routes";

const apiRouter: Router = express.Router();

apiRouter.use("/brands", brandsRouter);

export default apiRouter;
