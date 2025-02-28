const mongoose = require('mongoose');
require('dotenv').config()
// actually it should myiFood

// MongoDB connection URI
// const mongoURI = 'MONGO_URI';


// Global variables to store fetched data
global.food_items = [];
global.food_category = [];

const mongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB connected successfully");

    const db = mongoose.connection.db;
    
    // Fetch and log food items
    const food_items_data = await db.collection('food_items').find({}).toArray();
    if (food_items_data.length === 0) {
      console.log("Warning: No food items found in database");
    } else {
      console.log(`Found ${food_items_data.length} food items`);
    }
    global.food_items = food_items_data;
    
    // Fetch and log food categories
    const food_category_data = await db.collection('food_category').find({}).toArray();
    if (food_category_data.length === 0) {
      console.log("Warning: No food categories found in database");
    } else {
      console.log(`Found ${food_category_data.length} food categories`);
    }
    global.food_category = food_category_data;

  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = mongoDB;