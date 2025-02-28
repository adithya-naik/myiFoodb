const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
require('dotenv').config()
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.SECRET_KEY;

// Create User (New User creating a new account)
router.post(
  "/createUser",
  body("email", "Email is Not Valid").isEmail(),
  body("password", "Password should be minimum 5 Chars").isLength({ min: 5 }),
  body("name", "Name should be minimum 3 Chars").isLength({ min: 3 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(req.body.password, salt);

    try {
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword ,
        location: req.body.location,
      });

      res.json({ success: true });
    } catch {
      console.log("Error in creating user");
      res.json({ success: false });
    }
  }
);






// Existing User (Loging into his account)
router.post(
  "/loginUser",
  body("email", "Email is Not Valid").isEmail(),
  body("password", "Password should be minimum 5 Chars").isLength({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const email = req.body.email;
      let userData = await User.findOne({email});
      if(!userData){
        return res.status(400).json({ errors: "Try logging using Valid Credentials" });
      }
      const validPassword = await bcrypt.compare(req.body.password, userData.password);
      if(!validPassword){
        return res.status(400).json({ errors: "Try logging using Valid Credentials" });
      }

      const data = {
        user: {
          id: userData.id,
        },
      };
      const authToken = jwt.sign(data, jwtSecret);
      res.json({ success: true ,authToken:authToken});

    } catch {
      console.log("Error in Logging into account");
      res.json({ success: false });
    }
  }
);



module.exports = router;
