const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema({
  title: String,
  type: String,

  // code + banner were missing from the schema,
  // so mongoose silently dropped them from
  // data/promotions.json on every seed
  code: String,
  banner: String,

  discount: Number,
  description: String,
  expireDate: Date,
  active: Boolean
});

module.exports = mongoose.model(
  "Promotion",
  promotionSchema
);