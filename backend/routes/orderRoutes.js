const express = require("express");

const router = express.Router();

const Order =
  require("../models/Order");


// ======================
// CREATE ORDER
// ======================
router.post("/", async (req, res) => {
  try {
    const order =
      new Order(req.body);

    await order.save();

    res.json(order);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});


// ======================
// GET ALL ORDERS
// ======================
router.get("/", async (req, res) => {
  try {
    const orders =
      await Order.find()
        .sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});


// ======================
// UPDATE ORDER STATUS
// ======================
router.put("/:id", async (req, res) => {
  try {
    const updatedOrder =
      await Order.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(updatedOrder);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;