const express = require("express");
const apiRouter = express.Router();
const productsRouter = require("./productRouter")
const collectionsRouter = require('./collectionsRouter')

apiRouter.use('/products', productsRouter)
apiRouter.use('/collections', collectionsRouter)

module.exports = apiRouter;