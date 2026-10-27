
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // User's full name
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Name must contain at least 2 characters"],
      maxlength: [60, "Name cannot exceed 60 characters"],
    },

    // Email address used for login
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },

    // Contact number (optional)
    phone: {
      type: String,
      trim: true,
      default: "",
      maxlength: [20, "Phone number is too long"],
    },

    // Password will be hashed before saving
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must contain at least 8 characters"],
      select: false,
    },

    // Account type: farmer or equipment owner
    role: {
      type: String,
      enum: {
        values: ["farmer", "owner"],
        message: "Role must be either farmer or owner",
      },
      required: [true, "User role is required"],
      default: "farmer",
    },

    // User's location
    location: {
      type: String,
      trim: true,
      default: "",
      maxlength: [150, "Location cannot exceed 150 characters"],
    },

    // Profile image URL
    avatar: {
      type: String,
      default: "",
      trim: true,
    },

    // Account verification status
    isVerified: {
      type: Boolean,
      default: false,
    },

    // Account status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving a new password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
});

// Compare the entered password with its stored hash
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
