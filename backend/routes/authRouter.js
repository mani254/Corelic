const express = require('express')
const authRouter = express.Router()

const { register, activateUser } = require('../controllers/authController')



authRouter.post('/register', register)
authRouter.get('/activateuser', activateUser)

module.exports = authRouter