const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const { campgroundSchema } = require('../validateSchema.js')
const ExpressError = require('../utils/ExpressError')
const Campground = require("../models/campground")
const {isLoggedIn} = require('../middleware')
const campgroundcontroller = require('../controller/campground')
const validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body)
	if(error){
		const msg = error.details.map(el => el.message).join(',')
		throw new ExpressError(msg, 400)
	}else {
		next()
	}
}
router.get("/", catchAsync(campgroundcontroller.index))
router.get("/new", isLoggedIn ,campgroundcontroller.renderNewForm)
router.post("/",isLoggedIn , validateCampground, catchAsync(campgroundcontroller.addCampground))

router.get("/:id", catchAsync(async (req, res) => {
	const campground = await Campground.findById(req.params.id).populate('reviews')
	if(!campground){
		req.flash('error', 'Cannot find that campground')
		res.redirect('/campgrounds')
	}
	res.render('campgrounds/show', { campground })
}))

router.get("/:id/edit",isLoggedIn , catchAsync(campgroundcontroller.renderEditForm))
router.put("/:id",isLoggedIn , validateCampground, catchAsync(campgroundcontroller.editCampground))
router.delete("/:id/delete",isLoggedIn , catchAsync(campgroundcontroller.deleteCampground))
module.exports = router