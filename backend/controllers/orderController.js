const Order = require("../models/Order");


// GET ALL
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};


// CREATE
exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);

    await order.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};


// UPDATE STATUS
exports.updateOrder = async (req, res) => {
  try {
    const updated =
      await Order.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};