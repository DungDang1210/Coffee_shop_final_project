const express = require("express");

const router = express.Router();

const multer = require("multer");

const path = require("path");


// STORAGE
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {

    cb(
      null,
      Date.now() +
        path.extname(file.originalname)
    );

  }
});

const upload = multer({
  storage
});


// UPLOAD IMAGE
router.post(
"/",
upload.single("image"),
(req,res)=>{

if(!req.file){

return res.status(400).json({

message:"No image uploaded"

});

}

res.json({

imageUrl:
`http://localhost:5000/uploads/${req.file.filename}`

});

});

module.exports = router;
