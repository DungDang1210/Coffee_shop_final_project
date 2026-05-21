const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

require("dotenv").config();

const mongoose = require("mongoose");

const Product =
  require("./models/Product");

const products =
  require("./data/products.json");

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  });

const importData = async () => {

  try {

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log("Products Imported!");

    process.exit();

  } catch (err) {

    console.log(err);

    process.exit(1);

  }

};

importData();