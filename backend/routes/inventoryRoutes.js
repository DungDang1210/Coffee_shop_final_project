const express = require("express");
const router = express.Router();

const Inventory = require("../models/Inventory");
const InventoryHistory = require("../models/InventoryHistory");


// ======================
// GET ALL
// ======================

router.get("/", async (req, res) => {

    try {

        const items = await Inventory.find().sort({
            createdAt: -1
        });

        console.log("Inventory count:", items.length);

        res.json(items);

    }

    catch (err) {

        res.status(500).json(err);

    }

});


// ======================
// CREATE
// ======================

router.post("/", async (req, res) => {

    try {

      if (
            !req.body.name ||
            !req.body.category
        ){

            return res.status(400).json({
                message:"Missing information"
            });

        }

        const item = await Inventory.create(req.body);

        console.log("Created:");
        console.log(item);

        res.json(item);

    }

    catch (err) {

        res.status(500).json(err);

    }

});


// ======================
// UPDATE
// ======================

router.put("/:id", async (req, res) => {

    try {

        const item = await Inventory.findByIdAndUpdate(

            req.params.id,

            req.body,

            { new: true }

        );

        console.log("Updated:");
        console.log(item);

        if (!item) {

            return res.status(404).json({
                message: "Ingredient not found"
            });

        }

        res.json(item);

    }

    catch (err) {

        res.status(500).json(err);

    }

});


// ======================
// DELETE
// ======================

router.delete("/:id", async (req, res) => {

    try {

        const item = await Inventory.findByIdAndDelete(req.params.id);

        console.log("Deleted:");
        console.log(item);

        if(!item){

            return res.status(404).json({

                message:"Ingredient not found"

            });

        }

        res.json({

            success:true

        });

    }

    catch (err) {

        res.status(500).json(err);

    }

});


// ======================
// IMPORT STOCK
// ======================

router.put("/import/:id", async (req, res) => {

    try {

        const item = await Inventory.findById(req.params.id);

        console.log("========== IMPORT ==========");
        console.log("ID:", req.params.id);
        console.log("Request body:", req.body);
        console.log("Item from DB:", item);

        if (!item) {

            return res.status(404).json({
                message: "Ingredient not found"
            });

        }

        const stock = Number(req.body.stock);

        console.log("Receive stock:", stock);
        console.log("Current stock:", item.stock);

        if (stock <= 0) {

            return res.status(400).json({
                message: "Invalid stock"
            });

        }

        item.stock += stock;

        console.log("Before update:", item.stock);
        console.log("After update:", item.stock);

        await item.save();

        console.log("Saved successfully");

        await InventoryHistory.create({

            ingredient: item.name,

            action: "IMPORT",

            quantity: stock,

            unit: item.unit,

            note: "Stock Imported"

        });

        res.json(item);

    }

    catch (err) {
        
        console.log(err);

        res.status(500).json(err);

    }

});


// ======================
// EXPORT STOCK
// ======================

router.put("/export/:id", async (req, res) => {

    try {

        const item = await Inventory.findById(req.params.id);

        console.log("========== EXPORT ==========");
        console.log("ID:", req.params.id);
        console.log("Request body:", req.body);
        console.log("Item from DB:", item);

        if (!item) {

            return res.status(404).json({
                message: "Ingredient not found"
            });

        }

        const stock = Number(req.body.stock);

        console.log("Export stock:", stock);
        console.log("Current stock:", item.stock);

        if(stock <= 0){

            return res.status(400).json({

                message:"Invalid export quantity"

            });

        }


        if(item.stock < stock){

            return res.status(400).json({

                message:"Not enough stock"

            });

        }

        item.stock -= stock;

        console.log("Before export:", item.stock);
        console.log("After export:", item.stock);

        await item.save();

        await InventoryHistory.create({

            ingredient: item.name,

            action: "EXPORT",

            quantity: stock,

            unit: item.unit,

            note: "Stock Exported"

        });

        res.json(item);

    }

    catch (err) {

        console.log(err);

        res.status(500).json(err);

    }

});

// ======================
// GET HISTORY
// ======================

router.get("/history/all", async (req, res) => {

    try {

        const history =
            await InventoryHistory.find()
            .sort({
                createdAt: -1
            });

        res.json(history);

    }

    catch (err) {

        res.status(500).json(err);

    }

});

module.exports = router;
