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

    // ===== Member Rewards =====

    points: {
      type: Number,
      default: 0
    },

    // set the first time a member's points are
    // backfilled from their order history
    pointsSyncedAt: {
      type: Date,
      default: null
    },

    // highest tier this member has been granted
    // rewards for — used to detect upgrades
    rewardTier: {
      type: String,
      default: null
    },

    // Personal vouchers. Unlike /api/promotions
    // (public, everyone can use them) these belong
    // to one member only — the new-member 20% and
    // the tier rewards live here.
    vouchers: [
      {
        code: String,
        title: String,

        // PERCENT | FREESHIP | ...
        type: {
          type: String,
          default: "PERCENT"
        },

        discount: Number,

        // WELCOME | TIER
        source: String,

        description: String,

        used: {
          type: Boolean,
          default: false
        },

        usedAt: {
          type: Date,
          default: null
        },

        grantedAt: {
          type: Date,
          default: Date.now
        }
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