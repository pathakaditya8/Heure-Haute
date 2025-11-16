const User = require('../models/User');

// SIGN UP - Create new user
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Create new user (password stored as-is for simplicity, in production use bcrypt)
    const newUser = new User({
      email,
      password
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        email: newUser.email,
        userId: newUser._id
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// LOGIN - Verify credentials
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Verify password (simple comparison for now)
    if (user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Logged in successfully',
      data: {
        email: user.email,
        userId: user._id
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CHECK if user is logged in
exports.verifyLogin = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, isLoggedIn: false });
    }

    res.json({
      success: true,
      isLoggedIn: true,
      data: {
        email: user.email,
        userId: user._id
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
