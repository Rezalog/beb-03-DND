const express = require('express');
const router = express.Router();

const { usersController } = require('../controller');

// POST : /users/signup
router.post('/signup', usersController.singup.post);

// POST : /users/signin
router.get('/signin', usersController.signin.get);

// GET : /users/profile
router.get('/profile', usersController.profile.get);

module.exports = router;
