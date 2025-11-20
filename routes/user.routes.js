const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Register route
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Check if user already exists by either username or email
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// Login route - accepts either username or email
router.post('/login', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Find user by either username or email
        const user = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Create a token
        const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, { expiresIn: '1h' });
        res.json({ token });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// Logout route (client-side handles token deletion)
router.post('/logout', (req, res) => {
    // Client-side will handle token removal (e.g., localStorage.clear())
    res.json({ message: "Logged out successfully" });
});

module.exports = router;
