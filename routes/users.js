const express = require("express");

const router = express.Router();
const usersController = require("../controllers/users");

router.get("/me", usersController.getCurrentUser);

router.patch("/me", usersController.updateCurrentUser);

module.exports = router;
