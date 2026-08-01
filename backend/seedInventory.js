const mongoose = require("mongoose");
require("dotenv").config();

const Inventory = require("./models/Inventory");
const inventory = require("./data/inventory.json");

mongoose.connect(process.env.MONGO_URI)
.then(async()=>{

    await Inventory.deleteMany();

    await Inventory.insertMany(inventory);

    console.log("Inventory Imported");

    process.exit();

});