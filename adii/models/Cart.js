const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1
      },
      price: {
        type: Number,
        required: true
      },
      addedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  totalPrice: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update totalPrice before saving
cartSchema.pre('save', function(next) {
  this.totalPrice = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
