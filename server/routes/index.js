const express = require('express');
const router = express.Router();

const indexController = require("../controller/index");

router.get("/", indexController.main);

module.exports = router;