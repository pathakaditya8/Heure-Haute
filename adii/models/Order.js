const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  // Customer Information
  customer: {
    fullname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    postal: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    }
  },
  // Payment Information (stored securely - only last 4 digits of card)
  payment: {
    cardholderName: {
      type: String,
      required: true
    },
    cardLast4: {
      type: String,
      required: true
    },
    expiryMonth: {
      type: String,
      required: true
    },
    expiryYear: {
      type: String,
      required: true
    }
  },
  // Order Items
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      productName: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      price: {
        type: Number,
        required: true
      },
      itemTotal: {
        type: Number,
        required: true
      }
    }
  ],
  // Order Totals
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  taxRate: {
    type: Number,
    default: 0.18 // 18%
  },
  totalAmount: {
    type: Number,
    required: true
  },
  // Order Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'confirmed'
  },
  // Timestamps
  orderDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // Additional Info
  notes: {
    type: String,
    default: ''
  }
});

// Update timestamp before saving
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);
