const express = require("express");

const router = express.Router();

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");


// ======================
// GET ALL PRODUCTS
// ======================
router.get("/", getProducts);


// ======================
// CREATE PRODUCT
// ======================
router.post("/", createProduct);


// ======================
// UPDATE PRODUCT
// ======================
router.put("/:id", updateProduct);


// ======================
// DELETE PRODUCT
// ======================
router.delete("/:id", deleteProduct);


module.exports = router;