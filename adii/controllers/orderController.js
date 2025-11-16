const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Generate unique order ID
function generateOrderId() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `ORD-${timestamp.toUpperCase()}-${randomStr.toUpperCase()}`;
}

// Mask card number - keep only last 4 digits
function maskCardNumber(cardNumber) {
  const cleanCard = cardNumber.replace(/\s/g, '');
  return cleanCard.slice(-4);
}

// CREATE new order
exports.createOrder = async (req, res) => {
  try {
    const { userId, customer, payment, items, subtotal, tax, totalAmount } = req.body;

    // Validate required fields
    if (!userId || !customer || !payment || !items || !subtotal || !totalAmount) {
      return res.status(400).json({ success: false, message: 'Missing required order information' });
    }

    // Create order object
    const order = new Order({
      orderId: generateOrderId(),
      userId,
      customer,
      payment: {
        cardholderName: payment.cardname,
        cardLast4: maskCardNumber(payment.card),
        expiryMonth: payment.expiry.split('/')[0],
        expiryYear: payment.expiry.split('/')[1]
      },
      items: items.map(item => ({
        productId: item.productId._id || item.productId,
        productName: item.productId.name || item.productName,
        quantity: item.quantity,
        price: item.price,
        itemTotal: item.price * item.quantity
      })),
      subtotal,
      tax,
      totalAmount,
      status: 'confirmed'
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET order by ID
exports.getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId }).populate('items.productId');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET all orders for a user
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId })
      .populate('items.productId')
      .sort({ orderDate: -1 });

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CANCEL order
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOneAndUpdate(
      { orderId },
      { status: 'cancelled' },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, message: 'Order cancelled successfully', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.productId')
      .sort({ orderDate: -1 });

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
