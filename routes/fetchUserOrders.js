const express = require('express');
const router = express.Router();
const Order = require('../models/Orders'); 

// Route to fetch orders by email
router.post('/fetchOrders', async (req, res) => {
  try {
    const { email } = req.body; // Get email from request body

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Fetch orders by email
    const orders = await Order.findOne({ email });

    if (!orders || !orders.order_data || orders.order_data.length === 0) {
      return res.json({ success: true, data: [] }); // Return empty array instead of 404
    }

    // Ensure data is properly formatted
    const validOrderData = orders.order_data.map(orderGroup => {
      // Validate that the first item contains order_date
      if (!orderGroup[0] || !orderGroup[0].order_date) {
        // If no valid date, add current date as fallback
        orderGroup[0] = { order_date: new Date().toISOString() };
      }
      return orderGroup;
    });

    res.json({ success: true, data: validOrderData });
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
  }
});

module.exports = router;