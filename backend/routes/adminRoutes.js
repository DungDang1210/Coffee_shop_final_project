const express = require("express");

const router = express.Router();

router.post("/login", async (req, res) => {

  const { email, password } = req.body;

  // TEMP ADMIN
  if (
    email === "admin@gmail.com" &&
    password === "123456"
  ) {

    return res.json({
      admin: {
        name: "Admin",
        email,
        role: "admin"
      }
    });

  }

  return res.status(401).json({
    message: "Invalid credentials"
  });

});

module.exports = router;