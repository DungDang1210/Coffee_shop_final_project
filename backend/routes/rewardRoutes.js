const express = require("express");

const router = express.Router();

const User = require("../models/User");

const Order = require("../models/Order");

const authMiddleware =
  require("../middleware/auth");

const {
  TIERS,
  WELCOME_VOUCHER,
  resolveTier,
  syncMemberVouchers,
  pointsFromOrderHistory
} = require("../services/rewardsEngine");


// ======================
// TIER LADDER
// public so the UI can show every tier
// ======================
router.get("/tiers", (req, res) => {

  res.json(TIERS);

});


// ======================
// MY REWARDS
// ======================
router.get("/me", authMiddleware, async (req, res) => {

  try {

    const user =
      await User.findById(req.user.id);

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });

    }

    // One-time backfill: members who ordered
    // before rewards existed keep their history.
    if (!user.pointsSyncedAt) {

      user.points =
        await pointsFromOrderHistory(user._id);

      user.pointsSyncedAt = new Date();

    }

    // Grant the tier reward voucher if this member
    // has climbed to a new tier. This is what makes
    // an upgrade something they RECEIVE, not just
    // something they read about.
    const newlyGranted =
      syncMemberVouchers(user);

    if (user.isModified()) {
      await user.save();
    }

    const orderCount =
      await Order.countDocuments({
        userId: String(user._id)
      });

    res.json({
      ...resolveTier(user.points),
      tiers: TIERS,
      orderCount,
      memberSince: user.createdAt,

      // Every personal voucher. The welcome offer
      // is reported as used once the member has
      // ordered at all — it is a first-order perk,
      // and some legacy accounts still carry an
      // unused copy.
      vouchers: user.vouchers.map(v => {

        const spent =
          v.code === WELCOME_VOUCHER.code &&
          orderCount > 0;

        return {
          ...(v.toObject ? v.toObject() : v),
          used: v.used || spent
        };

      }),

      // just granted, for the "you unlocked
      // Silver" moment
      newlyGranted
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

});


module.exports = router;
