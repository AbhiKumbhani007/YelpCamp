const express = require('express')
const router = express.Router()
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const localStratagy = require('passport-local')
const userController = require('../controller/user')

router.route('/register')
	.get(userController.renderRegisterForm)
	.post(catchAsync(userController.registerUser))

router.route('/login')
	.get(userController.renderLoginForm)
	.post(passport.authenticate('local', { failureFlash: true, failureRedirect: 'login' }), userController.loginUser)

router.get('/logout', userController.logoutUser)

module.exports = router