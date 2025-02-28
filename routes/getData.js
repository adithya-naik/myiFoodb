const express = require('express');
const router = express.Router();

// Route to get all food items
router.get('/fooditems', async (req, res) => {
    try {
        if (!global.food_items || global.food_items.length === 0) {
            return res.status(404).json({ 
                success: false, 
                error: "No food items found. Database might be empty." 
            });
        }
        res.json({ success: true, foodItems: global.food_items });
    } catch (error) {
        console.error("Error fetching food items:", error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});


// Route to get all food categories
router.get('/foodcategory', async (req, res) => {
    try {
        if (!global.food_category || global.food_category.length === 0) {
            return res.status(404).json({ 
                success: false, 
                error: "No food categories found. Database might be empty." 
            });
        }
        res.json({ success: true, foodCategory: global.food_category });
    } catch (error) {
        console.error("Error fetching food categories:", error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});


module.exports = router;

