const pool = require("./dbConfig");
const dotenv = require("dotenv");
dotenv.config({ path: "env.default" }); // Load environment variables from .env file
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt"); // Used for hashing passwords
const jwt = require("jsonwebtoken"); //Generates tokens for  sign-in
const axios = require("axios");

const secretKey = process.env.SECRET_KEY; //Used with tokens

// Create an instance of Express app
const app = express();


//Log In - Authenticate User & Generate Access Token
app.post("/auth/login", async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      const getUser = "SELECT * FROM users WHERE username = ? OR email = ?"; // Adjust to table fields
      const [user] = await pool.query(getUser, [username, email]);
  
      if (!user || user.length === 0) { // Checks if user exists
        return res.status(401).json({ statusCode: 401, error: "User not found" });
      }
  
      const validatePassword = await bcrypt.compare(password, user[0].password); // Compares stored password to entered password
  
      if (!validatePassword) {
        return res.status(401).json({ statusCode: 401, error: "Invalid password" });
      }
    
      const accessToken = jwt.sign({ userId: user[0].idUsers }, secretKey, { // Generates access token with user data
        expiresIn: "1h",
      });
  
      res.status(200).json({ 
        statusCode: 200, 
        message: "Authentication successful!", 
        accessToken, 
      user: {
        user_id: user[0].idUsers, 
        full_name: user[0].full_name, 
        username: user[0].username, 
        email: user[0].email, 
        avatar: user[0].avatar, 
        bio: user[0].bio
      } 
  });
  
    } catch (error) {
      console.error("Error authenticating account:", error);
      res.status(500).json({ statusCode: 500, error: "Internal Server Error" });
    }
  });


  //Logout
app.get("/auth/logout", (req, res) => {
    res.json({ message: "Logout successful" });
  });

  

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

  