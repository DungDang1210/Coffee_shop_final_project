const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
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
      default: ""
    },

    description: {
      type: String,
      default: ""
    },

    category: {
      type: String,
      required: true
    },

    subcategory: {
      type: String,
      default: ""
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
    },

    // ===== AI Recommendation =====

    taste: {
      type: String,
      default: ""
    },

    temperature: {
      type: String,
      enum: ["Hot", "Cold", "Warm"],
      default: "Cold"
    },

    milk: {
      type: Boolean,
      default: false
    },

    caffeine: {
      type: Number,
      default: 0
    },

    intensity: {
      type: Number,
      default: 1
    }

  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Product",
  productSchema
);