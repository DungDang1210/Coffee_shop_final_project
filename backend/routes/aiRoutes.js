const express = require("express");

const router = express.Router();

const {
  chatAI,
  recommendAI
} = require("../controllers/aiController");

router.post("/chat", chatAI);

router.post("/recommend", recommendAI);

module.exports = router;