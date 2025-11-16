const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['evergreen', 'collections', 'exclusive']
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    default: ''
  },
  stock: {
    type: Number,
    default: 10
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 4.5
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
