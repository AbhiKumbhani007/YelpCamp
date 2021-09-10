const User = require('../models/user')
const passport = require('passport')
const localStratagy = require('passport-local')
module.exports.renderRegisterForm = (req, res) => {
	res.render('users/register')
}
module.exports.registerUser = async (req, res, next) => {
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

}
module.exports.renderLoginForm = (req, res) => {
	res.render('users/login')
}
module.exports.loginUser = passport.authenticate('local', { failureFlash: true, failureRedirect: 'login' }), (req, res) => {
	req.flash('success', 'Welcome back')
	const redirectUrl = req.session.returnTo || '/campgrounds'
	delete req.session.returnTo
	res.redirect(redirectUrl)
}
module.exports.logoutUser = (req, res) => {
	req.logOut()
	req.flash('success', 'Logged You Out')
	res.redirect('/campgrounds')
}