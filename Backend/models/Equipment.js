
const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Equipment owner is required"],
      index: true,
    },

    name: {
      type: String,
      required: [true, "Equipment name is required"],
      trim: true,
      minlength: [3, "Name must contain at least 3 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    category: {
      type: String,
      required: [true, "Equipment category is required"],
      enum: [
        "tractor",
        "plough",
        "cultivator",
        "seed_drill",
        "harvester",
        "sprayer",
        "rotavator",
        "irrigation",
        "thresher",
        "other",
      ],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    brand: {
      type: String,
      trim: true,
      default: "",
    },

    model: {
      type: String,
      trim: true,
      default: "",
    },

    pricePerDay: {
      type: Number,
      required: [true, "Daily rental price is required"],
      min: [0, "Price cannot be negative"],
    },

    pricePerHour: {
      type: Number,
      min: [0, "Hourly price cannot be negative"],
      default: null,
    },

    location: {
      type: String,
      required: [true, "Equipment location is required"],
      trim: true,
      maxlength: [150, "Location cannot exceed 150 characters"],
    },

    images: {
      type: [String],
      default: [],
      validate: {
        validator: (images) => images.length <= 10,
        message: "You can upload a maximum of 10 images",
      },
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      default: "active",
    },

    specifications: {
      horsepower: {
        type: Number,
        min: 0,
      },
      condition: {
        type: String,
        enum: ["new", "excellent", "good", "fair"],
        default: "good",
      },
    },
  },
  {
    timestamps: true,
  }
);

equipmentSchema.index({ category: 1, location: 1, isAvailable: 1 });

module.exports = mongoose.model("Equipment", equipmentSchema);
