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

const ALLOWED = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
];

const upload = multer({

  storage,

  limits: {
    fileSize: 5 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {

    if (!ALLOWED.includes(file.mimetype)) {

      return cb(
        new Error(
          "Only JPG, PNG, WEBP or GIF images are allowed."
        )
      );

    }

    cb(null, true);

  }

});


// UPLOAD IMAGE
router.post(
  "/",

  (req, res, next) => {

    upload.single("image")(req, res, (err) => {

      if (err) {

        // always answer with JSON so the client
        // can read the reason
        return res.status(400).json({
          message:
            err.code === "LIMIT_FILE_SIZE"
              ? "Image must be smaller than 5MB."
              : err.message
        });

      }

      next();

    });

  },

  (req, res) => {

    if (!req.file) {

      return res.status(400).json({
        message: "No image uploaded"
      });

    }

    res.json({
      imageUrl:
        `http://localhost:5000/uploads/${req.file.filename}`
    });

  }
);

module.exports = router;
