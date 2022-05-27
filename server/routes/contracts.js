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

// POST : /contracts/v2pair
router.post("/v2pair", contractsController.v2pair.post);

// GET : /contracts/v2pair
router.get("/v2pair", contractsController.v2pair.get);

// POST : /contracts/v2pair
router.post("/v2token", contractsController.v2token.post);

// GET : /contracts/v2pair
router.get("/v2token", contractsController.v2token.get);

module.exports = router;
