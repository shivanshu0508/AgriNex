
const Booking = require("../models/Booking");
const Equipment = require("../models/Equipment");
const apiResponse = require("../utils/apiResponse");

const createBooking = async (req, res, next) => {
  try {
    const { equipmentId, startDate, endDate, notes } = req.body;

    if (!equipmentId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Equipment, start date, and end date are required.",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      start < new Date() ||
      end <= start
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid future rental date range.",
      });
    }

    const equipment = await Equipment.findById(equipmentId);

    if (!equipment || equipment.status !== "active" || !equipment.isAvailable) {
      return res.status(404).json({
        success: false,
        message: "Equipment is not available.",
      });
    }

    if (equipment.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot book your own equipment.",
      });
    }

    // Reject overlapping bookings that are already approved or in progress.
    const conflictingBooking = await Booking.findOne({
      equipment: equipment._id,
      status: {
        $in: ["approved", "confirmed", "ongoing"],
      },
      startDate: { $lt: end },
      endDate: { $gt: start },
    });

    if (conflictingBooking) {
      return res.status(409).json({
        success: false,
        message: "Equipment is already booked for these dates.",
      });
    }

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (days < 1) {
      return res.status(400).json({
        success: false,
        message: "Rental must be at least one day.",
      });
    }

    const booking = await Booking.create({
      equipment: equipment._id,
      farmer: req.user._id,
      owner: equipment.owner,
      startDate: start,
      endDate: end,
      totalAmount: days * equipment.pricePerDay,
      notes,
      status: "pending",
      paymentStatus: "pending",
    });

    return apiResponse(res, 201, "Booking request created.", booking);
  } catch (error) {
    next(error);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ farmer: req.user._id })
      .populate("equipment", "name category images pricePerDay location")
      .populate("owner", "fullName phone")
      .sort({ createdAt: -1 });

    return apiResponse(res, 200, "Your bookings retrieved.", bookings);
  } catch (error) {
    next(error);
  }
};

const getOwnerBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id })
      .populate("equipment", "name category images pricePerDay")
      .populate("farmer", "fullName email phone")
      .sort({ createdAt: -1 });

    return apiResponse(res, 200, "Rental requests retrieved.", bookings);
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["approved", "rejected", "completed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be approved, rejected, or completed.",
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (booking.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot update this booking.",
      });
    }

    const canRespondToRequest =
      booking.status === "pending" && ["approved", "rejected"].includes(status);
    const canCompleteBooking =
      booking.status === "approved" && status === "completed";

    if (!canRespondToRequest && !canCompleteBooking) {
      return res.status(400).json({
        success: false,
        message: "Pending bookings can be approved or rejected; approved bookings can be completed.",
      });
    }

    if (status === "approved") {
      const conflict = await Booking.findOne({
        _id: { $ne: booking._id },
        equipment: booking.equipment,
        status: { $in: ["approved", "confirmed", "ongoing"] },
        startDate: { $lt: booking.endDate },
        endDate: { $gt: booking.startDate },
      });

      if (conflict) {
        return res.status(409).json({
          success: false,
          message: "Another booking overlaps these dates.",
        });
      }
    }

    booking.status = status;
    if (status === "completed") {
      booking.paymentStatus = "paid";
    }
    await booking.save();

    return apiResponse(res, 200, `Booking ${status}.`, booking);
  } catch (error) {
    next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    const isFarmer = booking.farmer.toString() === req.user._id.toString();
    const isOwner = booking.owner.toString() === req.user._id.toString();

    if (!isFarmer && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "You cannot cancel this booking.",
      });
    }

    if (!["pending", "approved"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: "This booking can no longer be cancelled here.",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    return apiResponse(res, 200, "Booking cancelled.", booking);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  updateBookingStatus,
  cancelBooking,
};
