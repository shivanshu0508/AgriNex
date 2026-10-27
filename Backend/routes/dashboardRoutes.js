
const express = require("express");
const {
  getFarmerDashboard,
  getOwnerDashboard,
} = require("../controllers/dashboardController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/farmer",
  protect,
  authorizeRoles("farmer"),
  getFarmerDashboard
);

router.get(
  "/owner",
  protect,
  authorizeRoles("owner"),
  getOwnerDashboard
);

module.exports = router;
