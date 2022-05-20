const express = require("express");
const router = express.Router();

const { tokensController } = require("../controller");

// POST : /tokens/info
router.post("/info", tokensController.info.post);

// GET : /tokens/info
router.get("/info", tokensController.info.get);

module.exports = router;
