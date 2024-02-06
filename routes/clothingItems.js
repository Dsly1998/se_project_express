const express = require("express");
const router = express.Router();
const clothingItemsController = require("../controllers/clothingItems");
const authMiddleware = require("../middlewares/auth");
const { validateCardBody, validateId } = require("../middlewares/validation");

// Route for getting all items without protection
router.get("/", clothingItemsController.getAllItems);

// Protect all subsequent routes with the auth middleware
router.use(authMiddleware);

// Apply validation for creating a clothing item
router.post("/", validateCardBody, clothingItemsController.createItem);

// Apply validation for routes with IDs
router.delete("/:id", validateId, clothingItemsController.deleteItem); 
router.put("/:id/likes", validateId, clothingItemsController.likeItem);
router.delete("/:id/likes", validateId, clothingItemsController.dislikeItem);

module.exports = router;
