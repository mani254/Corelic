const express = require("express");
const apiRouter = express.Router();
const productsRouter = require("./productRouter")
const collectionsRouter = require('./collectionsRouter');
const brandsRouter = require('./brandRouter')


apiRouter.use('/products', productsRouter)
apiRouter.use('/collections', collectionsRouter)
apiRouter.use('/brands', brandsRouter)

module.exports = apiRouter;