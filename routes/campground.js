const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const { campgroundSchema } = require('../validateSchema.js')
const ExpressError = require('../utils/ExpressError')
const Campground = require("../models/campground")
const { isLoggedIn } = require('../middleware')
const campgroundcontroller = require('../controller/campground')
const validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body)
	if (error) {
		const msg = error.details.map(el => el.message).join(',')
		throw new ExpressError(msg, 400)
	} else {
		next()
	}
}
router.route('/')
	.get(catchAsync(campgroundcontroller.index))
	.post(isLoggedIn, validateCampground, catchAsync(campgroundcontroller.addCampground))

router.get("/new", isLoggedIn, campgroundcontroller.renderNewForm)

router.route('/:id')
	.get(catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id).populate('reviews')
		if (!campground) {
			req.flash('error', 'Cannot find that campground')
			res.redirect('/campgrounds')
		}
		res.render('campgrounds/show', { campground })
	}))
	.put(isLoggedIn, validateCampground, catchAsync(campgroundcontroller.editCampground))
	.delete(isLoggedIn, catchAsync(campgroundcontroller.deleteCampground))

router.get("/:id/edit", isLoggedIn, catchAsync(campgroundcontroller.renderEditForm))

module.exports = router