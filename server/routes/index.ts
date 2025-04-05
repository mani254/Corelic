import express, { Router } from "express";
import brandsRouter from "./brandRouter";
import collectionsRouter from "./collectionsRouter";
import productsRouter from "./productRouter";
import variantRouter from "./variantRouter";

const apiRouter: Router = express.Router();

apiRouter.use("/products", productsRouter);
apiRouter.use("/collections", collectionsRouter);
apiRouter.use("/brands", brandsRouter);
apiRouter.use("/variants", variantRouter);

export default apiRouter;
