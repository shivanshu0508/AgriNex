
const express = require("express");
const {
  getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  getMyEquipment,
} = require("../controllers/equipmentController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

// Specific routes must come before /:id.
router.get("/", getEquipment);
router.get("/mine", protect, authorizeRoles("owner"), getMyEquipment);
router.get("/:id", getEquipmentById);

router.post(
  "/",
  protect,
  authorizeRoles("owner"),
  createEquipment
);

router.patch(
  "/:id",
  protect,
  authorizeRoles("owner"),
  updateEquipment
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("owner"),
  deleteEquipment
);

module.exports = router;
