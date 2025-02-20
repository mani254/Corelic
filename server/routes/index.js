const express = require("express");
const apiRouter = express.Router();
const productsRouter = require("./productRouter")

apiRouter.use('/products', productsRouter)

module.exports = apiRouter;