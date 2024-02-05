const express = require("express");
const router = express.Router();
const {validateUserBody, validateLogin } = require("../middlewares/validation")

// Import necessary controllers
const { login, createUser } = require("../controllers/users"); // Assuming the functions are in this location

// POST handler for signing in
router.post("/signin", validateLogin, login);

// POST handler for signing up
router.post("/signup", validateUserBody, createUser);

// Other routes, if any other centralized routes are required later

module.exports = router;
