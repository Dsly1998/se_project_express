const express = require("express");
const { validateUpdateUser } = require("../middlewares/validation");
const router = express.Router();
const usersController = require("../controllers/users");

router.get("/me", usersController.getCurrentUser);

router.patch("/me", validateUpdateUser, usersController.updateCurrentUser);

module.exports = router;
