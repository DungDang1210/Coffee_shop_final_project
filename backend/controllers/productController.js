const Product = require("../models/Product");


// ======================
// GET ALL PRODUCTS
// ======================
const getProducts = async (req, res) => {

  try {

    const products = await Product.find();

    res.json(products);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};


// ======================
// CREATE PRODUCT
// ======================
const createProduct = async (req, res) => {

  try {

    const product = new Product(req.body);

    const savedProduct =
      await product.save();

    res.status(201).json(savedProduct);

  } catch (err) {

    res.status(400).json({
      message: err.message
    });

  }

};


// ======================
// UPDATE PRODUCT
// ======================
const updateProduct = async (req, res) => {

  try {

    const updatedProduct =
      await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true
        }
      );

    res.json(updatedProduct);

  } catch (err) {

    res.status(400).json({
      message: err.message
    });

  }

};


// ======================
// DELETE PRODUCT
// ======================
const deleteProduct = async (req, res) => {

  try {

    await Product.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        "Product deleted successfully"
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};


module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
};