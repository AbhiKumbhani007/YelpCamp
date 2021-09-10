const express = require('express')
const router = express.Router({mergeParams: true})
const Review = require('../models/review')
const Campground = require("../models/campground")
const { reviewSchema } = require('../validateSchema.js')
const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')
const reviewController = require('../controller/review')
const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body)
	if(error){
		const msg = error.details.map(el => el.message).join(',')
		throw new ExpressError(msg, 400)
	}else {
		next()
	}
}
router.post("/",validateReview, catchAsync(reviewController.createReview))
router.delete("/:reviewId", catchAsync(reviewController.deleteReview))
module.exports = router