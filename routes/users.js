const express = require('express')
const router = express.Router()
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const localStratagy = require('passport-local')
const userController = require('../controller/user')

router.get('/register', (req, res) => {
	res.render('users/register')
})

router.post('/register', catchAsync(async (req, res, next) => {
	try {
		const { email, username, password } = req.body
		const user = new User({ email, username })
		const registerdUser = await User.register(user, password)
		req.login(registerdUser, err => {
			if (err) {
				return next(err)
			} else {
				req.flash('success', 'Registered and Logged in successfully')
				res.redirect('/campgrounds')
			}
		})

	} catch (e) {
		req.flash('error', e.message)
		res.redirect('/register')
	}

}))

router.get('/login', (req, res) => {
	res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: 'login' }), (req, res) => {
	req.flash('success', 'Welcome back')
	const redirectUrl = req.session.returnTo || '/campgrounds'
	delete req.session.returnTo
	res.redirect(redirectUrl)
})

router.get('/logout', (req, res) => {
	req.logOut()
	req.flash('success', 'Logged You Out')
	res.redirect('/campgrounds')
})

module.exports = router