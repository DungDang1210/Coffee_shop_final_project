const Order = require("../models/Order");


// =======================
// AI CHAT
// =======================
exports.chatAI = async (req, res) => {
  const { message } = req.body;

  let reply =
    "I recommend trying our Latte ☕";

  if (
    message.toLowerCase().includes("strong")
  ) {
    reply = "Try Espresso 💪";
  }

  if (
    message.toLowerCase().includes("sweet")
  ) {
    reply = "Caramel Latte is perfect 🍯";
  }

  res.json({ reply });
};


// =======================
// AI RECOMMEND
// =======================
exports.recommendAI = async (
  req,
  res
) => {
  try {
    const { userId } = req.body;

    const orders =
      await Order.find({ userId });

    if (!orders.length) {
      return res.json({
        message: "No history",
        recommendations: []
      });
    }

    const lastOrder =
      orders[orders.length - 1];

    const lastItem =
      lastOrder.items[0];

    res.json({
      message: `Because you liked ${lastItem.name}`,

      recommendations: [
        {
          name: "Cappuccino",
          reason:
            "Similar taste profile"
        },
        {
          name: "Latte",
          reason:
            "Smooth milk coffee"
        }
      ]
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};