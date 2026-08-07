const express = require("express");

const router = express.Router();

const Order =
  require("../models/Order");

const User =
  require("../models/User");

const {
  pointsForOrder,
  WELCOME_VOUCHER,
  TIER_VOUCHERS
} = require("../services/rewardsEngine");

const authMiddleware =
  require("../middleware/auth");

// codes that must be owned to be used
const PERSONAL_CODES = new Set([
  WELCOME_VOUCHER.code,
  ...Object.values(TIER_VOUCHERS)
    .map(v => v.code)
]);


// ======================
// CREATE ORDER
// ======================
router.post("/", async (req, res) => {
  try {

    // ===== PERSONAL VOUCHER CHECK =====
    // Codes like WELCOME20 / SILVER5 belong to one
    // member. Verify ownership here so a customer
    // who does not have it cannot claim it by
    // posting the code directly.
    const code = req.body.promotionCode;

    const userId = req.body.userId;

    let voucherOwner = null;

    let ownedVoucher = null;

    if (code && userId && userId !== "guest") {

      voucherOwner =
        await User.findById(userId);

      ownedVoucher =
        voucherOwner?.vouchers?.find(
          v => v.code === code && !v.used
        );

    }

    if (
      code &&
      PERSONAL_CODES.has(code) &&
      !ownedVoucher
    ) {

      return res.status(403).json({
        error:
          `The voucher ${code} is not available on your account.`
      });

    }

    // The welcome voucher is a FIRST-ORDER offer.
    // Checking order history rather than just
    // ownership means legacy accounts that still
    // carry an unused WELCOME20 can't spend it.
    if (
      code === WELCOME_VOUCHER.code &&
      userId &&
      userId !== "guest"
    ) {

      const previousOrders =
        await Order.countDocuments({
          userId: String(userId)
        });

      if (previousOrders > 0) {

        return res.status(403).json({
          error:
            "The new-member offer only applies to your first order."
        });

      }

    }

    const order =
      new Order(req.body);

    await order.save();

    // burn the personal voucher so it is
    // single-use
    if (ownedVoucher && voucherOwner) {

      try {

        ownedVoucher.used = true;

        ownedVoucher.usedAt = new Date();

        voucherOwner.isNewUser = false;

        await voucherOwner.save();

      } catch (voucherErr) {

        console.log(
          "Voucher consume failed:",
          voucherErr.message
        );

      }

    }

    // ===== MEMBER REWARDS =====
    // Never let a rewards failure lose the order.
    try {

      const earned = pointsForOrder(order);

      if (
        earned > 0 &&
        order.userId &&
        order.userId !== "guest"
      ) {

        await User.findByIdAndUpdate(
          order.userId,
          {
            $inc: { points: earned }
          }
        );

      }

    } catch (rewardErr) {

      console.log(
        "Reward points failed:",
        rewardErr.message
      );

    }

    res.json(order);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});


// ======================
// GET ALL ORDERS
// ======================
router.get("/", async (req, res) => {
  try {
    const orders =
      await Order.find()
        .sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});


// ======================
// CUSTOMER CANCELS THEIR OWN ORDER
//
// Separate from the admin status route so the
// "only while Pending" rule is enforced on the
// server, not just hidden in the UI.
// ======================
router.put(
  "/:id/cancel",
  authMiddleware,
  async (req, res) => {

    try {

      const order =
        await Order.findById(req.params.id);

      if (!order) {

        return res.status(404).json({
          error: "Order not found"
        });

      }

      if (
        String(order.userId) !==
        String(req.user.id)
      ) {

        return res.status(403).json({
          error: "This is not your order"
        });

      }

      if (order.status !== "Pending") {

        return res.status(409).json({
          error:
            order.status === "Cancelled"
              ? "This order is already cancelled."
              : `Your order is already ${order.status.toLowerCase()} — it can no longer be cancelled.`
        });

      }

      order.status = "Cancelled";

      order.cancelledBy = "customer";

      order.cancelledAt = new Date();

      await order.save();

      res.json(order);

    } catch (err) {

      res.status(500).json({
        error: err.message
      });

    }

  }
);


// ======================
// UPDATE ORDER STATUS (admin)
// ======================
router.put("/:id", async (req, res) => {
  try {

    const patch = { ...req.body };

    // this route is the admin panel, so a cancel
    // here is an admin cancel — not a customer one
    if (patch.status === "Cancelled") {

      patch.cancelledBy = "admin";

      patch.cancelledAt = new Date();

    }

    // moving an order back out of Cancelled clears
    // the attribution
    if (
      patch.status &&
      patch.status !== "Cancelled"
    ) {

      patch.cancelledBy = null;

      patch.cancelledAt = null;

    }

    const updatedOrder =
      await Order.findByIdAndUpdate(
        req.params.id,
        patch,
        { new: true }
      );

    res.json(updatedOrder);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;