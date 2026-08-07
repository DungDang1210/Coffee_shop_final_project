const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({

  productId: {
    type: String,
    required: true,
    index: true
  },

  userId: {
    type: String,
    default: null
  },

  authorName: {
    type: String,
    required: true
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  title: {
    type: String,
    default: ""
  },

  comment: {
    type: String,
    required: true
  },

  // true when the reviewer actually ordered it
  verifiedPurchase: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
});

module.exports = mongoose.model(
  "Review",
  reviewSchema
);
