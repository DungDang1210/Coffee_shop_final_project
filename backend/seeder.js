const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

require("dotenv").config();

const mongoose = require("mongoose");

const Product = require("./models/Product");
const products = require("./data/products.json");

const Promotion = require("./models/Promotion");
const promotions = require("./data/promotions.json");

const Recipe = require("./models/Recipe");
const recipes = require("./data/recipes.json");

const Inventory = require("./models/Inventory");
const inventory = require("./data/inventory.json");

async function runSeeder() {

  try {

    console.log(process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    await Product.deleteMany();
    await Product.insertMany(products);

    await Promotion.deleteMany();
    await Promotion.insertMany(promotions);

    await Recipe.deleteMany();
    await Recipe.insertMany(recipes);

    await Inventory.deleteMany();
    await Inventory.insertMany(inventory);

    console.log("All Data Imported!");

    process.exit(0);

  } catch (err) {

    console.error(err);

    process.exit(1);

  }

}

runSeeder();