const express = require("express");
const router = express.Router();

router.post("/momo", async (req,res)=>{

    res.json({

        success:true,

        message:"Payment Success"

    });

});

module.exports = router;