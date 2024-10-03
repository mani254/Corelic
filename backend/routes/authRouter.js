const express = require('express')
const authRouter = express.Router()

const { register, activateUser, requestOtp, verifyOtp, passwordChange } = require('../controllers/authController')


authRouter.post('/register', register)
authRouter.get('/activateuser', activateUser)
authRouter.post('/requestOtp', requestOtp)
authRouter.post('/verifyOtp', verifyOtp)
authRouter.post('/changePassword', passwordChange)

module.exports = authRouter