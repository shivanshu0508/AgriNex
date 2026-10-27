
const Review = require("../models/Review");
const Booking = require("../models/Booking");
const apiResponse = require("../utils/apiResponse");

const createReview = async (req, res, next) => {
  try {
    const { bookingId, rating, comment } = req.body;

    if (!bookingId || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: "Booking ID and rating are required.",
      });
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a whole number between 1 and 5.",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (booking.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only review your own bookings.",
      });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "You can review equipment after the rental is completed.",
      });
    }

    const existingReview = await Review.findOne({ booking: booking._id });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "A review already exists for this booking.",
      });
    }

    const review = await Review.create({
      equipment: booking.equipment,
      farmer: req.user._id,
      booking: booking._id,
      rating: numericRating,
      comment,
    });

    return apiResponse(res, 201, "Review submitted.", review);
  } catch (error) {
    next(error);
  }
};

const getEquipmentReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({
      equipment: req.params.equipmentId,
    })
      .populate("farmer", "fullName avatar")
      .sort({ createdAt: -1 });

    return apiResponse(res, 200, "Reviews retrieved.", reviews);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getEquipmentReviews,
};
