const express = require("express");

const router = express.Router();

// Import necessary controllers
const { login, createUser } = require("../controllers/users"); // Assuming the functions are in this location

// POST handler for signing in
router.post("/signin", login);

// POST handler for signing up
router.post("/signup", createUser);

// Other routes, if any other centralized routes are required later

module.exports = router;
