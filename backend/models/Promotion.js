const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema({
  title: String,
  type: String,
  discount: Number,
  description: String,
  active: Boolean
});

module.exports = mongoose.model(
  "Promotion",
  promotionSchema
);