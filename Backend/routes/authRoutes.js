const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

// Generate JWT Token
const generateToken = (id, role = 'user') => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'your_fittrack_secret_key', {
        expiresIn: '30d',
    });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ name, email, password });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Login user or admin
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // First check in Admin table
        const admin = await Admin.findOne({ email });
        if (admin && (await admin.comparePassword(password))) {
            return res.json({
                _id: admin._id,
                email: admin.email,
                role: 'admin',
                token: generateToken(admin._id, 'admin'),
            });
        }

        // Then check in User table
        const user = await User.findOne({ email });
        if (user && (await user.comparePassword(password))) {
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: 'user',
                token: generateToken(user._id),
            });
        }

        res.status(401).json({ message: 'User not found or Invalid credentials' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
