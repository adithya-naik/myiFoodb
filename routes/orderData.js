const express = require('express');
const router = express.Router();
const Order = require('../models/Orders'); // Make sure to require your Order model

// Route to post order in the table
router.post('/orderData', async (req, res) => {
  try {
    let data = req.body.order_data;
    data.splice(0, 0, { order_date: req.body.order_date });

    let emailId = await Order.findOne({ email: req.body.email });
    console.log(emailId);

    if (emailId === null) {
      // Create a new order if email not found
      await Order.create({
        email: req.body.email,
        order_data: [data], // Correctly assign the array
      });
      res.json({ success: true });
    } else {
      // Update the existing order with new data
      await Order.findOneAndUpdate(
        { email: req.body.email },
        { $push: { order_data: data } }
      );
      res.json({ success: true });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error: " + error.message);
  }
});

module.exports = router;
