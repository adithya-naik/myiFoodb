const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

// Get User Profile
router.post("/getUserProfile", async (req, res) => {
  console.log("getUserProfile route hit", req.body);
  try {
    const { email } = req.body;
    
    if (!email) {
      console.log("No email provided in request");
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    
    console.log(`Looking for user with email: ${email}`);
    
    // Find user by email
    const userData = await User.findOne({ email });
    
    console.log("User lookup result:", userData ? "User found" : "User not found");
    
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    // Return user data without the password
    const userProfile = {
      name: userData.name,
      email: userData.email,
      location: userData.location || "",
      _id: userData._id
    };
    
    console.log("Sending user profile data:", userProfile);
    return res.status(200).json({ success: true, user: userProfile });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ success: false, message: "Server error" });
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
    console.log("updateProfile route hit", req.body);
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    
    try {
      const { email, name, location, password, currentEmail } = req.body;
      
      // Find user by their current email
      let user = await User.findOne({ email: currentEmail });
      
      if (!user) {
        console.log(`User not found with email: ${currentEmail}`);
        return res.status(404).json({ success: false, message: "User not found" });
      }
      
      console.log("Found user to update:", {
        id: user._id,
        currentName: user.name,
        currentEmail: user.email
      });
      
      // Check if new email is already in use by another user
      if (email !== currentEmail) {
        const emailExists = await User.findOne({ email });
        if (emailExists && emailExists._id.toString() !== user._id.toString()) {
          return res.status(400).json({ success: false, message: "Email already in use" });
        }
      }
      
      // Update user fields directly
      user.name = name;
      user.email = email;
      user.location = location;
      
      // If password is being updated
      if (password && password.length >= 5) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        console.log("Password hashed and ready to be saved");
      }
      
      // Save the updated user
      await user.save();
      
      console.log("User updated successfully:", {
        id: user._id,
        name: user.name,
        email: user.email,
        location: user.location
      });
      
      res.json({ 
        success: true,
        message: "Profile updated successfully",
        user: {
          name: user.name,
          email: user.email,
          location: user.location
        }
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ 
        success: false, 
        message: "Server error", 
        error: error.message 
      });
    }
  }
);

// Delete User Account
router.post(
  "/deleteAccount",
  [
    body("email", "Email is required").isEmail(),
    body("password", "Password is required").notEmpty()
  ],
  async (req, res) => {
    console.log("deleteAccount route hit");
    
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    
    try {
      const { email, password } = req.body;
      
      // Find user by email
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      
      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid password" });
      }
      
      console.log(`Deleting user with email: ${email}`);
      
      // Delete the user
      await User.findByIdAndDelete(user._id);
      
      console.log("User deleted successfully");
      
      res.json({
        success: true,
        message: "Account deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting account:", error);
      res.status(500).json({ 
        success: false, 
        message: "Server error", 
        error: error.message 
      });
    }
  }
);

module.exports = router;