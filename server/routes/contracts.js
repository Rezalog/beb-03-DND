const express = require("express");
const router = express.Router();

const { contractsController } = require("../controller");

// POST : /contracts/token
router.post("/token", contractsController.token.post);

// GET : /contracts/token
router.get("/token", contractsController.token.get);

// POST : /contracts/pair
router.post("/pair", contractsController.pair.post);

// GET : /contracts/pair
router.get("/pair", contractsController.pair.get);

module.exports = router;
