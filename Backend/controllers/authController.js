
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const apiResponse = require("../utils/apiResponse");

const register = async (req, res, next) => {
  try {
    const { fullName, email, password, phone, location, role } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, and password are required.",
      });
    }

    const accountRole = role || "farmer";

    if (!["farmer", "owner"].includes(accountRole)) {
      return res.status(400).json({
        success: false,
        message: "Role must be either farmer or owner.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // User.js hashes the password in its pre-save hook.
    const user = await User.create({
      fullName,
      email: normalizedEmail,
      password,
      phone,
      location,
      role: accountRole,
    });

    const token = generateToken(user._id);

    return apiResponse(res, 201, "Registration successful.", {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user._id);

    return apiResponse(res, 200, "Login successful.", {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = req.user;

    return apiResponse(res, 200, "User profile retrieved.", {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      location: user.location,
      avatar: user.avatar,
      isVerified: user.isVerified,
    });
  } catch (error) {
    next(error);
  }
};

const updateMe = async (req, res, next) => {
  try {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Provide profile fields in a JSON object.",
      });
    }

    const editableFields = ["fullName", "email", "phone", "location"];
    const submittedFields = Object.keys(req.body);
    const unsupportedField = submittedFields.find(
      (field) => !editableFields.includes(field)
    );

    if (unsupportedField) {
      return res.status(400).json({
        success: false,
        message: `The ${unsupportedField} field cannot be updated.`,
      });
    }

    if (submittedFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one profile field to update.",
      });
    }

    for (const field of submittedFields) {
      if (typeof req.body[field] !== "string") {
        return res.status(400).json({
          success: false,
          message: `${field} must be a string.`,
        });
      }

      req.user[field] = field === "email"
        ? req.body[field].trim().toLowerCase()
        : req.body[field];
    }

    await req.user.save();

    return apiResponse(res, 200, "Profile updated.", {
      id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone,
      location: req.user.location,
      avatar: req.user.avatar,
      isVerified: req.user.isVerified,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateMe };
