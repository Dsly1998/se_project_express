const express = require("express");
const router = express.Router();
const clothingItemsController = require("../controllers/clothingItems");
const authMiddleware = require("../middlewares/auth"); // Import the auth middleware
const { validateCardBody } = require("../middlewares/validation");

// Route for getting all items without protection
router.get("/", clothingItemsController.getAllItems);

// Protect all subsequent routes with the auth middleware
router.use(authMiddleware);

router.post("/", validateCardBody, clothingItemsController.createItem);
router.delete("/:itemId", clothingItemsController.deleteItem);
router.put("/:id/likes", clothingItemsController.likeItem);
router.delete("/:id/likes", clothingItemsController.dislikeItem);

module.exports = router;
