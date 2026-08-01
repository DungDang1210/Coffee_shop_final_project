const mongoose = require("mongoose");

const inventoryHistorySchema = new mongoose.Schema({

    ingredient: {
        type: String,
        required: true
    },

    action: {
        type: String,
        enum: ["IMPORT", "EXPORT"],
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    unit: {
        type: String,
        required: true
    },

    note: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "InventoryHistory",
    inventoryHistorySchema
);