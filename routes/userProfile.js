// Backend - Add this to your existing routes file
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
require('dotenv').config()
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.SECRET_KEY;

// Get User Profile
// Route to get user profile data by email
router.post("/getUserProfile", async (req, res) => {
  try {
    const email = req.body.email;
    
    // Find user by email
    const userData = await User.findOne({ email });
    
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    // Return user data without the password
    const userProfile = {
      name: userData.name,
      email: userData.email,
      location: userData.location,
      _id: userData._id
    };
    
    res.json({ success: true, user: userProfile });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update User Profile
router.post(
  "/updateProfile",
  [
    body("name", "Name should be minimum 3 characters").isLength({ min: 3 }),
    body("email", "Email is not valid").isEmail(),
    body("location", "Location is required").notEmpty()
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { email, name, location, password, currentEmail } = req.body;
      
      // Find user by their current email
      const userData = await User.findOne({ email: currentEmail });
      
      if (!userData) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      
      // Prepare update object
      const updateData = {
        name,
        location
      };
      
      // If email is being changed, update it
      if (email !== currentEmail) {
        // Check if the new email already exists
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          return res.status(400).json({ success: false, message: "Email already in use" });
        }
        updateData.email = email;
      }
      
      // If password is being updated
      if (password && password.length >= 5) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      }
      
      // Update user profile
      await User.findByIdAndUpdate(
        userData._id,
        { $set: updateData },
        { new: true }
      );
      
      res.json({ 
        success: true, 
        message: "Profile updated successfully",
        user: {
          name: updateData.name,
          email: updateData.email || currentEmail,
          location: updateData.location
        }
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

module.exports = router;