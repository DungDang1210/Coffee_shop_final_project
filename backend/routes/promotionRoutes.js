const express = require("express");
const Promotion = require("../models/Promotion");

const router = express.Router();

router.get("/", async (req, res) => {

  const promotions =
    await Promotion.find({
      active: true
    });

  res.json(promotions);

});

module.exports = router;
