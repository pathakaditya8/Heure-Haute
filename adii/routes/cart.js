const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// GET user's cart
router.get('/:userId', cartController.getCart);

// ADD to cart
router.post('/add', cartController.addToCart);

// UPDATE cart item
router.put('/update', cartController.updateCartItem);

// REMOVE from cart
router.delete('/remove', cartController.removeFromCart);

// CLEAR cart
router.delete('/clear/:userId', cartController.clearCart);

module.exports = router;
