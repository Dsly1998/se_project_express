const express = require('express');
const router = express.Router();
const clothingItemsController = require('../controllers/clothingItems');

router.get('/', clothingItemsController.getAllItems);
router.post('/', clothingItemsController.createItem);
router.delete('/:itemId', clothingItemsController.deleteItem);
router.put('/items/:itemId/likes', clothingItemsController.likeItem);
router.delete('/items/:itemId/likes', clothingItemsController.dislikeItem);

module.exports = router;
