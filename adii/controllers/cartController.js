const Cart = require('../models/Cart');
const Product = require('../models/Product');

// GET user's cart
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    let cart = await Cart.findOne({ userId }).populate('items.productId');
    
    // Don't auto-create empty cart - only return if it exists
    if (!cart) {
      return res.json({ success: true, data: { userId, items: [] } });
    }
    
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADD item to cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;

    // Find or create cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if item already in cart
    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId: productId,
        quantity: quantity,
        price: product.price
      });
    }

    await cart.save();
    // Populate product data before returning
    await cart.populate('items.productId');
    res.status(201).json({ success: true, data: cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// UPDATE cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be greater than 0' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.find(item => item.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not in cart' });
    }

    item.quantity = quantity;
    await cart.save();
    // Populate product data before returning
    await cart.populate('items.productId');
    
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// REMOVE item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();
    // Populate product data before returning
    await cart.populate('items.productId');

    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CLEAR entire cart
exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();
    // Populate product data before returning (will be empty but consistent)
    await cart.populate('items.productId');

    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
