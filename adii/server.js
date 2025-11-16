const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();
const connectDB = require('./config/database');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/auth', require('./routes/auth'));

// Page Routes (serve EJS templates)
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/catalogue', (req, res) => {
  res.render('catalogue');
});

app.get('/cart', (req, res) => {
  res.render('cart');
});

app.get('/product/:id', (req, res) => {
  res.render('product-details', { productId: req.params.id });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/checkout', (req, res) => {
  res.render('checkout');
});

app.get('/order-confirmation', (req, res) => {
  res.render('order-confirmation');
});

app.get('/track-package', (req, res) => {
  res.render('track-package');
});

app.get('/settings', (req, res) => {
  res.render('settings');
});

app.get('/wishlist', (req, res) => {
  res.render('wishlist');
});

// 404 Handler
app.use((req, res) => {
  res.status(404).render('404');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', { error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Nodemon will auto-restart on file changes during development`);
});
