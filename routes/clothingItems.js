const express = require('express');
const router = express.Router();
const clothingItemsController = require('../controllers/clothingItems');

router.get('/', clothingItemsController.getAllItems);
router.post('/', clothingItemsController.createItem);
router.delete('/:itemId', clothingItemsController.deleteItem);
router.put('/:itemId/likes', clothingItemsController.likeItem);
router.delete('/:itemId/likes', clothingItemsController.dislikeItem);

module.exports = router;
