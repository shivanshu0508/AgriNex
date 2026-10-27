
const Equipment = require("../models/Equipment");
const apiResponse = require("../utils/apiResponse");

const getEquipment = async (req, res, next) => {
  try {
    const {
      search,
      category,
      location,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {
      status: "active",
      isAvailable: true,
    };

    if (category) filter.category = category;

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.pricePerDay = {};

      if (minPrice !== undefined) {
        filter.pricePerDay.$gte = Number(minPrice);
      }

      if (maxPrice !== undefined) {
        filter.pricePerDay.$lte = Number(maxPrice);
      }
    }

    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(50, Math.max(1, Number(limit) || 12));

    const [equipment, total] = await Promise.all([
      Equipment.find(filter)
        .populate("owner", "fullName location")
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize),
      Equipment.countDocuments(filter),
    ]);

    return apiResponse(res, 200, "Equipment retrieved.", {
      equipment,
      pagination: {
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getEquipmentById = async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
      .populate("owner", "fullName location phone");

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found.",
      });
    }

    return apiResponse(res, 200, "Equipment retrieved.", equipment);
  } catch (error) {
    next(error);
  }
};

const createEquipment = async (req, res, next) => {
  try {
    const {
      name,
      category,
      description,
      brand,
      model,
      pricePerDay,
      pricePerHour,
      location,
      images,
      specifications,
    } = req.body;

    const equipment = await Equipment.create({
      owner: req.user._id,
      name,
      category,
      description,
      brand,
      model,
      pricePerDay,
      pricePerHour,
      location,
      images,
      specifications,
    });

    return apiResponse(res, 201, "Equipment listed successfully.", equipment);
  } catch (error) {
    next(error);
  }
};

const updateEquipment = async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found.",
      });
    }

    if (equipment.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot update another owner's equipment.",
      });
    }

    const allowedFields = [
      "name",
      "category",
      "description",
      "brand",
      "model",
      "pricePerDay",
      "pricePerHour",
      "location",
      "images",
      "specifications",
      "isAvailable",
      "status",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        equipment[field] = req.body[field];
      }
    }

    await equipment.save();

    return apiResponse(res, 200, "Equipment updated.", equipment);
  } catch (error) {
    next(error);
  }
};

const deleteEquipment = async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found.",
      });
    }

    if (equipment.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete another owner's equipment.",
      });
    }

    // Deactivate the listing rather than permanently deleting it.
    equipment.status = "inactive";
    equipment.isAvailable = false;

    await equipment.save();

    return apiResponse(res, 200, "Equipment listing deactivated.");
  } catch (error) {
    next(error);
  }
};

const getMyEquipment = async (req, res, next) => {
  try {
    const equipment = await Equipment.find({ owner: req.user._id })
      .sort({ createdAt: -1 });

    return apiResponse(res, 200, "Your equipment retrieved.", equipment);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  getMyEquipment,
};
