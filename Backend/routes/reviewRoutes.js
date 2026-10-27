
const express = require("express");
const {
  createReview,
  getEquipmentReviews,
} = require("../controllers/reviewController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/equipment/:equipmentId", getEquipmentReviews);

router.post(
  "/",
  protect,
  authorizeRoles("farmer"),
  createReview
);

module.exports = router;
