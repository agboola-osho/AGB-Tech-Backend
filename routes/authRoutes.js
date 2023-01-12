const express = require('express')
const router = express.Router()
const authController = require('../controllers/authControllers')

router.post('/signup', authController.signup)

router.post('/login', authController.login)

router.get('/refresh', authController.refresh)

router.post('/logout', authController.logout)

module.exports = router