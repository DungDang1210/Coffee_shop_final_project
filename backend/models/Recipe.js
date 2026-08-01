const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({

  productName: String,

  ingredients: [

    {

      ingredientName: String,

      quantity: Number,

      unit: String

    }

  ]

});

module.exports =
mongoose.model(
  "Recipe",
  recipeSchema
);