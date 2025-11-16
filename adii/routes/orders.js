const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// CREATE new order
router.post('/create', orderController.createOrder);

// GET order by order ID
router.get('/:orderId', orderController.getOrder);

// GET all orders for a user
router.get('/user/:userId', orderController.getUserOrders);

// UPDATE order status
router.put('/:orderId/status', orderController.updateOrderStatus);

// CANCEL order
router.delete('/:orderId/cancel', orderController.cancelOrder);

// GET all orders (admin)
router.get('/', orderController.getAllOrders);

module.exports = router;
