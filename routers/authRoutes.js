const express = require('express')
const { login, signup, getProfile } = require('../controller/authController')
const auth = require('../middleware/auth')
const router = express.Router()


router.post('/login', login)
router.post('/signup', signup)
router.get('/profile', auth, getProfile)

module.exports = router