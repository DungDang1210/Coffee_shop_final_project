const express = require("express");

const router = express.Router();

const Review = require("../models/Review");

const Order = require("../models/Order");

const User = require("../models/User");

const authMiddleware =
  require("../middleware/auth");


// =====================================
// SUMMARY + LIST FOR ONE PRODUCT
//
// Returns the real average and the star
// distribution, so the UI no longer has to
// invent "4.8 (124 reviews)".
// =====================================
router.get("/:productId", async (req, res) => {

  try {

    const reviews = await Review.find({
      productId: String(req.params.productId)
    }).sort({ createdAt: -1 });

    const count = reviews.length;

    const average =
      count
        ? Number(
            (
              reviews.reduce(
                (s, r) => s + r.rating,
                0
              ) / count
            ).toFixed(1)
          )
        : 0;

    // how many gave 5 stars, 4 stars, ...
    const distribution = [5, 4, 3, 2, 1]
      .reduce((acc, star) => {

        acc[star] = reviews.filter(
          r => r.rating === star
        ).length;

        return acc;

      }, {});

    res.json({
      reviews,
      count,
      average,
      distribution
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

});


// =====================================
// WRITE A REVIEW
//
// Only signed-in customers, one per product,
// and flagged as a verified purchase when the
// order history backs it up.
// =====================================
router.post("/", authMiddleware, async (req, res) => {

  try {

    const {
      productId,
      rating,
      title,
      comment
    } = req.body;

    if (!productId || !rating || !comment?.trim()) {

      return res.status(400).json({
        message:
          "Product, rating and comment are required."
      });

    }

    const score = Number(rating);

    if (
      !Number.isInteger(score) ||
      score < 1 ||
      score > 5
    ) {

      return res.status(400).json({
        message: "Rating must be 1 to 5 stars."
      });

    }

    const existing = await Review.findOne({
      productId: String(productId),
      userId: String(req.user.id)
    });

    if (existing) {

      return res.status(409).json({
        message:
          "You have already reviewed this drink."
      });

    }

    const user =
      await User.findById(req.user.id);

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });

    }

    // did they actually buy it?
    const purchased =
      await Order.countDocuments({
        userId: String(req.user.id),
        "items.productId": String(productId)
      });

    const review = await Review.create({
      productId: String(productId),
      userId: String(req.user.id),
      authorName: user.name || "Customer",
      rating: score,
      title: (title || "").trim(),
      comment: comment.trim(),
      verifiedPurchase: purchased > 0
    });

    res.status(201).json(review);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

});


module.exports = router;
