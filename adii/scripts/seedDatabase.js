const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/heure-haute', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedDatabase = async () => {
  try {
    // Read products.json
    const productsPath = path.join(__dirname, '../products.json');
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Flatten categories and products
    const allProducts = [];
    productsData.categories.forEach((category) => {
      category.products.forEach((product) => {
        allProducts.push({
          id: product.id,
          name: product.name,
          category: category.id,
          image: product.image,
          price: Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000, // Random price between 5000-15000
          description: `Premium ${product.name} from Heure Haute collection. Crafted with precision and elegance.`,
          stock: Math.floor(Math.random() * 20) + 5, // Random stock 5-25
          rating: (Math.random() * (5 - 4) + 4).toFixed(1) // Rating between 4-5
        });
      });
    });

    // Insert products into database
    const insertedProducts = await Product.insertMany(allProducts);
    console.log(`✅ Successfully seeded ${insertedProducts.length} products to MongoDB`);
    
    // Display sample
    console.log('\nSample products:');
    insertedProducts.slice(0, 3).forEach((product) => {
      console.log(`  - ${product.name} (${product.category}): ₹${product.price}`);
    });

    mongoose.connection.close();
    console.log('\n✅ Database seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
