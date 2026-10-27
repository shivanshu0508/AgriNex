
const express = require("express");
const {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  updateBookingStatus,
  cancelBooking,
} = require("../controllers/bookingController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);

router.post(
  "/",
  authorizeRoles("farmer"),
  createBooking
);

router.get(
  "/mine",
  authorizeRoles("farmer"),
  getMyBookings
);

router.get(
  "/owner",
  authorizeRoles("owner"),
  getOwnerBookings
);

router.patch(
  "/:id/status",
  authorizeRoles("owner"),
  updateBookingStatus
);

router.patch(
  "/:id/cancel",
  authorizeRoles("farmer", "owner"),
  cancelBooking
);

module.exports = router;
