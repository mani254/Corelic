const express = require("express");
const apiRouter = express.Router();

const authRouter = require('./authRouter')

apiRouter.use('/auth', authRouter)

module.exports = apiRouter;