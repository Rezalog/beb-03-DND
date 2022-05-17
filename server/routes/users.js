const express = require("express");
const router = express.Router();

const { usersController } = require("../controller");

// POST : /users/signup
router.post("/signup/:user_address", usersController.signup.post);

// GET : /users/signin
router.get("/signin/:user_address", usersController.signin.get); // params를 받을때 /:를통해 받음

// GET : /users/profile
router.get("/profile", usersController.profile.get);

module.exports = router;
