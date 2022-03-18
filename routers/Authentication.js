const router = require('express').Router()
const {RegisterUser, VerifyEmail} = require('../controllers/authentication/Signup')
const Login = require('../controllers/authentication/Login')
const Logout = require('../controllers/authentication/Logout')

const authRequired = require('../middleware/AuthMiddleware')
const { changePassword, resetPassword } = require('../controllers/authentication/ResetPassword')

router.post('/signup', RegisterUser)
router.get('/verify/:token', VerifyEmail)

router.post('/login', Login)
router.post('/logout',authRequired, Logout)
router.post('/change-password', authRequired, changePassword)
router.post('/reset-password', resetPassword)

module.exports = router