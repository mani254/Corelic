import express, { Router } from "express";
import brandsRouter from "./brandRouter";

const apiRouter: Router = express.Router();

apiRouter.use("/brands", brandsRouter);

export default apiRouter;
