const express = require("express");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

// ======================
// AUTH MIDDLEWARE
// ======================

const authMiddleware =
  require("../middleware/auth");

const {
  WELCOME_VOUCHER
} = require("../services/rewardsEngine");

const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ======================
// UPDATE PROFILE
// ======================

router.put("/profile", authMiddleware, async(req,res)=>{

    try{


      const {
        name,
        avatar,
        phone
      } = req.body;


      // only overwrite what was actually sent
      const patch = {};

      if (name !== undefined) patch.name = name;

      if (avatar !== undefined) patch.avatar = avatar;

      if (phone !== undefined) {
        patch.phone = String(phone).trim();
      }


      const user =
        await User.findByIdAndUpdate(

          req.user.id,

          patch,

          {
            new:true
          }

        );



      res.json({

        user

      });



    }
    catch(err){


      res.status(500).json({

        message:err.message

      });


    }


  });

// ======================
// REGISTER
// ======================
router.post("/register", async (req, res) => {
  try {

    const {
        name,
        phone,
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
    //
    // The welcome voucher is granted here, on the
    // server. It used to be sent from the register
    // form and silently dropped, which is why the
    // new-member 20% never actually existed.
    const user =
      new User({
        name,
        phone,
        email,
        password: hashedPassword,
        isNewUser: true,
        vouchers: [
          {
            ...WELCOME_VOUCHER,
            used: false,
            grantedAt: new Date()
          }
        ]
      });

    await user.save();

    res.json({
      message: "Register successful",
      welcomeVoucher: WELCOME_VOUCHER
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
      user
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ======================
// GOOGLE LOGIN
// ======================

router.post("/google", async (req, res) => {

  try {

    const { credential } = req.body;

    const ticket = await client.verifyIdToken({

      idToken: credential,

      audience: process.env.GOOGLE_CLIENT_ID

    });

    const payload = ticket.getPayload();

    let user = await User.findOne({

      email: payload.email

    });

    if (!user) {

      user = await User.create({

        name: payload.name,

        email: payload.email,

        avatar: payload.picture,

        password: "",

        role: "customer",

        favorites: [],

        // new Google members get the welcome
        // voucher too
        vouchers: [
          {
            ...WELCOME_VOUCHER,
            used: false,
            grantedAt: new Date()
          }
        ],

        isNewUser: true

      });

    }

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

      user

    });

  }

  catch (err) {

    console.log(err);

    res.status(500).json({

      message: "Google Login Failed"

    });

  }

});

module.exports = router;