const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      default:""
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    avatar: {
        type: String,
        default: ""
    },

    password: {
      type: String,
      default:""
    },

    role: {
      type: String,
      default: "customer"
    },

    isNewUser: {
      type: Boolean,
      default: true
    },

    vouchers: [
      {
        code: String,
        discount: Number,
        used: Boolean
      }
    ]
  },

  {
    timestamps: true
  },

  
);

module.exports =
  mongoose.model(
    "User",
    userSchema,
    "users"
  );