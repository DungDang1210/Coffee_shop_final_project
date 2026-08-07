const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const mongoose = require("mongoose");

const orderRoutes = require("./routes/orderRoutes");
const aiRoutes = require("./routes/aiRoutes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const path = require("path");
const uploadRoutes = require("./routes/uploadRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const promotionRoutes = require("./routes/promotionRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const historyRoutes = require("./routes/historyRoutes");
const rewardRoutes = require("./routes/rewardRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();


// ======================
// MIDDLEWARE
// ======================
app.use(cors());
  
// 2mb, not the 100kb default: some existing
// users still have a base64 avatar stored on
// their record, and resending it on a profile
// save used to fail with a 413
app.use(express.json({ limit: "2mb" }));


// ======================
// ROUTES
// ======================
app.use("/api/orders", orderRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/admin", adminRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/upload", uploadRoutes);

app.use("/api/payment", paymentRoutes);

app.use("/api/promotions", promotionRoutes);

app.use("/api/inventory", inventoryRoutes);

app.use("/api/history", historyRoutes);

app.use("/api/rewards", rewardRoutes);

app.use("/api/reviews", reviewRoutes);

// ======================
// DATABASE
// ======================
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("MongoDB Error:", err);
  });


// ======================
// TEST ROUTE
// ======================
app.get("/", (req, res) => {
  res.send("API is running...");
});


// ======================
// SERVER
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});