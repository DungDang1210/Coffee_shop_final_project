const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  image: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  category: {
    type: String,

    enum: [
      "Signature",

      "Coffee",
      "Tea",
      "Smoothie",
      "Juice",
      "Soda",
      "Dessert Drink",

      "Sweet",
      "Bakery"
    ],

    required: true
  },

  subcategory: {
    type: String,
    required: true
  },

  bestSeller: {
    type: Boolean,
    default: false
  },

  signature: {
    type: Boolean,
    default: false
  },

  seasonal: {
    type: Boolean,
    default: false
  },

  available: {
    type: Boolean,
    default: true
  }

}, {
  timestamps: true
});

module.exports =
  mongoose.model(
    "Product",
    productSchema
  );