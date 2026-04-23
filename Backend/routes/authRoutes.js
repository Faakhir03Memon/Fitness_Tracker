const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/authMiddleware');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService');

// Generate JWT Token
const generateToken = (id, role = 'user') => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'your_fittrack_secret_key', {
        expiresIn: '30d',
    });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post('/signup', async (req, res) => {
    const { name, email, password, weight, height, age, gender } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        await User.create({
            name,
            email,
            password,
            weight,
            height,
            age,
            gender
        });

        res.status(201).json({ message: 'Account created successfully! You can login now.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check for Admin first
        const admin = await Admin.findOne({ email });
        if (admin) {
            const isMatch = await admin.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Incorrect admin password.' });
            }
            return res.json({
                _id: admin._id,
                email: admin.email,
                role: 'admin',
                token: generateToken(admin._id, 'admin'),
            });
        }

        // 2. Check for Regular User
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'No account found with this email. Please sign up first.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password. Please try again.' });
        }

        // Check if account is banned
        if (user.isBanned) {
            return res.status(403).json({ message: 'Your account has been suspended by an admin.' });
        }

        return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: 'user',
            token: generateToken(user._id, 'user'),
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'No account found with this email address.' });
        }

        // Generate reset token (expires in 1 hour)
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Check if email is configured
        const emailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;

        if (emailConfigured) {
            try {
                await sendPasswordResetEmail(email, user.name, resetToken);
                res.json({ message: 'Password reset link has been sent to your email.' });
            } catch (emailError) {
                console.error('Nodemailer Error:', emailError);
                return res.status(500).json({ message: 'Failed to send email. Please check your SMTP settings.' });
            }
        } else {
            console.log('Reset Link (No Email Config):', `http://localhost:5173/reset-password/${resetToken}`);
            res.status(500).json({ message: 'Email service not configured. Please contact administrator.' });
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Error processing request.' });
    }
});

// @route   POST /api/auth/reset-password/:token
// @desc    Reset password using token
router.post('/reset-password/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Reset link is invalid or has expired.' });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password has been reset successfully! You can now login.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/auth/profile
// @desc    Get user profile
router.get('/profile', protect, async (req, res) => {
    if (req.user) {
        res.json(req.user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
router.put('/profile', protect, async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.weight = req.body.weight !== undefined ? req.body.weight : user.weight;
        user.height = req.body.height !== undefined ? req.body.height : user.height;
        user.age = req.body.age !== undefined ? req.body.age : user.age;
        user.gender = req.body.gender !== undefined ? req.body.gender : user.gender;
        if (req.body.password) user.password = req.body.password;
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            weight: updatedUser.weight,
            height: updatedUser.height,
            age: updatedUser.age,
            gender: updatedUser.gender,
            role: 'user',
            token: generateToken(updatedUser._id, 'user'),
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Social Login
router.post('/social-login', async (req, res) => {
    try {
        const { email, name, provider } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                email, name,
                password: Math.random().toString(36).slice(-8),
                provider: provider || 'social'
            });
        }
        if (user.isBanned) {
            return res.status(403).json({ message: 'Account is banned' });
        }
        res.json({
            _id: user._id, name: user.name, email: user.email,
            role: 'user', token: generateToken(user._id, 'user')
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
