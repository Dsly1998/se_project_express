const express = require("express");
const { NotFoundError } = require("../middlewares/NotFoundError");

const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const clothingItemRoutes = require("./clothingItems");
const userRoutes = require("./users");
const {
  validateUserBody,
  validateLogin,
} = require("../middlewares/validation");

router.use("/users", authMiddleware, userRoutes);
router.use("/items", authMiddleware, clothingItemRoutes);

// Import necessary controllers
const { login, createUser } = require("../controllers/users"); // Assuming the functions are in this location

// POST handler for signing in
router.post("/signin", validateLogin, login);

// POST handler for signing up
router.post("/signup", validateUserBody, createUser);

// Other routes, if any other centralized routes are required later
router.use(authMiddleware);

router.use((req, res, next) => {
  console.log(res);
  return next(
    new NotFoundError("The request was sent to a non-existent address"),
  );
});

module.exports = router;
