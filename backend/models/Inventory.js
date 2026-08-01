const mongoose = require("mongoose");
const inventorySchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  supplier: {
    type: String,
    default: "Unknown"
  },

  stock: {
    type: Number,
    default: 0
  },

  unit: {
    type: String,
    required: true
  },

  minStock: {
    type: Number,
    default: 5
  },

  costPrice: {
    type: Number,
    default: 0
  },

  location: {
    type: String,
    default: "Main Warehouse"
  },

  status: {
    type: String,
    default: "Available"
  }

}, {
  timestamps: true
});

module.exports = mongoose.model(
  "Inventory",
  inventorySchema
);