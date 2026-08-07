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
    },

    // ===== Reviews =====
    // These were in data/products.json all along but
    // missing from the schema, so mongoose dropped
    // them on every seed. That is why the UI fell
    // back to a hard-coded "4.8 (124 reviews)".
    // Kept in sync from the Review collection.
    rating: {
      type: Number,
      default: 0
    },

    reviewCount: {
      type: Number,
      default: 0
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