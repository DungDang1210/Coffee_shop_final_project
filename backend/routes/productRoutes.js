const express = require("express")
const router = express.Router()
const Product = require("../models/Product")

// GET all products
router.get("/", async (req, res) => {
  const products = await Product.find()
  res.json(products)
})

// GET product by id
router.get("/:id", async (req,res)=>{

try{

const product =
await Product.findById(req.params.id);

if(!product){

return res.status(404).json({

message:"Product not found"

});

}

res.json(product);

}
catch(err){

res.status(500).json(err);

}

});

// CREATE product
router.post("/", async (req, res) => {
  const product = new Product(req.body)
  const savedProduct = await product.save()
  res.json(savedProduct)
})

// UPDATE product
router.put("/:id", async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )
  res.json(updatedProduct)
})

// DELETE product
router.delete("/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id)
  res.json({ message: "Product deleted" })
})

module.exports = router;