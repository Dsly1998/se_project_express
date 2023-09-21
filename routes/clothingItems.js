const express = require("express");

const router = express.Router();
const clothingItemsController = require("../controllers/clothingItems");

router.get("/", clothingItemsController.getAllItems);
router.post("/", clothingItemsController.createItem);
router.delete("/:itemId", clothingItemsController.deleteItem);
router.put("/:id/likes", clothingItemsController.likeItem);
router.delete("/:id/likes", clothingItemsController.dislikeItem);

module.exports = router;
