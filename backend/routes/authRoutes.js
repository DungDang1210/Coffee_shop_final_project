const express = require("express");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

// ======================
// AUTH MIDDLEWARE
// ======================

const authMiddleware = (req,res,next)=>{

    const token =
      req.headers.authorization?.split(" ")[1];


    if(!token){

      return res.status(401).json({
        message:"No token"
      });

    }


    try{

      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );


      req.user = decoded;


      next();


    }catch(err){

      res.status(401).json({
        message:"Invalid token"
      });

    }

  };

const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ======================
// UPDATE PROFILE
// ======================

router.put("/profile", authMiddleware, async(req,res)=>{

    try{


      const {
        name,
        avatar
      } = req.body;



      const user =
        await User.findByIdAndUpdate(

          req.user.id,

          {
            name,
            avatar
          },

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

        vouchers: [],

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