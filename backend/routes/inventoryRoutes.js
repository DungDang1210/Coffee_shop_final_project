const express = require("express");
const router = express.Router();

const Inventory = require("../models/Inventory");
const InventoryHistory = require("../models/InventoryHistory");

const multer = require("multer");
const XLSX = require("xlsx");

const upload = multer({
    dest: "uploads/"
});


// ======================
// STATUS IS DERIVED, NOT TYPED
//
// `status` used to be a free-text field that
// defaulted to "Available" and never changed, so
// an ingredient could read Available at 0 kg.
// Every write recomputes it from stock now.
// ======================

const STATUS = {
    OUT: "Out of Stock",
    LOW: "Low Stock",
    OK: "Available"
};

function deriveStatus(item = {}) {

    const stock = Number(item.stock) || 0;

    const minStock = Number(item.minStock) || 0;

    if (stock <= 0) return STATUS.OUT;

    if (stock <= minStock) return STATUS.LOW;

    return STATUS.OK;

}


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

// ======================
// IMPORT EXCEL
// ======================

    router.post(
        "/import-excel",
        upload.single("file"),
        async (req, res) => {

            try {

                const workbook =
                    XLSX.readFile(req.file.path);

                const sheet =
                    workbook.Sheets[
                        workbook.SheetNames[0]
                    ];

                const rows =
                    XLSX.utils.sheet_to_json(sheet);

                for (const row of rows) {

                    const exist =
                        await Inventory.findOne({
                            name: row.name
                        });

                    if (exist) {

                        exist.stock += Number(row.stock);

                        await exist.save();

                        await InventoryHistory.create({

                            ingredient: exist.name,

                            action: "IMPORT",

                            quantity: Number(row.stock),

                            unit: exist.unit,

                            note: "Imported from Excel"

                        });

                    }

                    else {

                        const item =
                            await Inventory.create({

                                name: row.name,

                                category: row.category,

                                supplier: row.supplier,

                                stock: Number(row.stock),

                                unit: row.unit,

                                minStock: Number(row.minStock),

                                costPrice: Number(row.costPrice),

                                location: row.location,

                                status: "Available"

                            });

                        await InventoryHistory.create({

                            ingredient: item.name,

                            action: "IMPORT",

                            quantity: item.stock,

                            unit: item.unit,

                            note: "Created from Excel"

                        });

                    }

                }

                res.json({
                    success: true
                });

            }

            catch (err) {

                console.log(err);

                res.status(500).json(err);

            }

        }
    );

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

        const item = await Inventory.create({
            ...req.body,
            status: deriveStatus(req.body)
        });

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

        // recompute status from the incoming stock so
        // it can never disagree with the numbers
        const existing =
            await Inventory.findById(req.params.id);

        if (!existing) {

            return res.status(404).json({
                message: "Ingredient not found"
            });

        }

        const merged = {
            ...existing.toObject(),
            ...req.body
        };

        const item = await Inventory.findByIdAndUpdate(

            req.params.id,

            {
                ...req.body,
                status: deriveStatus(merged)
            },

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
        if (!item) {

            return res.status(404).json({
                message: "Ingredient not found"
            });

        }

        const stock = Number(req.body.stock);

        if (stock <= 0) {

            return res.status(400).json({
                message: "Invalid stock"
            });

        }

        item.stock += stock;

        item.status = deriveStatus(item);

        await item.save();

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
        if (!item) {

            return res.status(404).json({
                message: "Ingredient not found"
            });

        }

        const stock = Number(req.body.stock);

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

        item.status = deriveStatus(item);

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

module.exports = router;
