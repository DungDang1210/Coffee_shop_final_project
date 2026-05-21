const express = require("express");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User =
  require("../models/User");

const router = express.Router();


// ======================
// REGISTER
// ======================
router.post("/register", async (req, res) => {
  try {

    const {
      name,
      email,
      password
    } = req.body;

    // check existing
    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    // hash password
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // create user
    const user =
      new User({
        name,
        phone,
        email,
        password: hashedPassword
      });

    await user.save();

    res.json({
      message: "Register successful"
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});


// ======================
// LOGIN
// ======================
router.post("/login", async (req, res) => {
  try {

    const {
      email,
      password
    } = req.body;

    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    // compare password
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message: "Wrong password"
      });
    }

    // create token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d"
      }
    );

    res.json({
      token,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;