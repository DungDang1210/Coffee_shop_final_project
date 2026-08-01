const express = require("express");

const router = express.Router();

const InventoryHistory =
require("../models/InventoryHistory");

router.get("/", async(req,res)=>{

    try{

        const history=

        await InventoryHistory.find()

        .sort({

            createdAt:-1

        });

        res.json(history);

    }

    catch(err){

        res.status(500).json(err);

    }

});

module.exports=router;
