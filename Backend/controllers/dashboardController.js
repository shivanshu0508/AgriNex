
const Booking = require("../models/Booking");
const Equipment = require("../models/Equipment");
const Review = require("../models/Review");
const apiResponse = require("../utils/apiResponse");

const getFarmerDashboard = async (req, res, next) => {
  try {
    const farmerId = req.user._id;

    const [totalBookings, pendingBookings, completedBookings, recentBookings] =
      await Promise.all([
        Booking.countDocuments({ farmer: farmerId }),
        Booking.countDocuments({ farmer: farmerId, status: "pending" }),
        Booking.countDocuments({ farmer: farmerId, status: "completed" }),
        Booking.find({ farmer: farmerId })
          .populate("equipment", "name images pricePerDay")
          .sort({ createdAt: -1 })
          .limit(5),
      ]);

    return apiResponse(res, 200, "Farmer dashboard retrieved.", {
      statistics: {
        totalBookings,
        pendingBookings,
        completedBookings,
      },
      recentBookings,
    });
  } catch (error) {
    next(error);
  }
};

const getOwnerDashboard = async (req, res, next) => {
  try {
    const ownerId = req.user._id;

    const [totalEquipment, activeEquipment, pendingRequests, bookings] =
      await Promise.all([
        Equipment.countDocuments({ owner: ownerId }),
        Equipment.countDocuments({ owner: ownerId, status: "active" }),
        Booking.countDocuments({ owner: ownerId, status: "pending" }),
        Booking.find({ owner: ownerId }).select("totalAmount paymentStatus"),
      ]);

    const paidRevenue = bookings.reduce((total, booking) => {
      return booking.paymentStatus === "paid"
        ? total + booking.totalAmount
        : total;
    }, 0);

    return apiResponse(res, 200, "Owner dashboard retrieved.", {
      statistics: {
        totalEquipment,
        activeEquipment,
        pendingRequests,
        paidRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFarmerDashboard,
  getOwnerDashboard,
};
