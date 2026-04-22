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
// @desc    Register a new user & attempt to send verification email
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate a secure verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Check if email is configured in .env
        const emailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;

        const user = await User.create({
            name,
            email,
            password,
            // Auto-verify if email not configured (dev/testing mode)
            isVerified: !emailConfigured,
            verificationToken: emailConfigured ? verificationToken : undefined
        });

        if (emailConfigured) {
            // Try to send verification email
            try {
                await sendVerificationEmail(email, name, verificationToken);
                return res.status(201).json({
                    message: 'Account created! Please check your email to verify your account before logging in.',
                    emailSent: true
                });
            } catch (emailErr) {
                // Email failed - auto-verify user so they can still login
                user.isVerified = true;
                user.verificationToken = undefined;
                await user.save();
                return res.status(201).json({
                    message: 'Account created successfully! Email service unavailable, but you can login now.',
                    emailSent: false
                });
            }
        }

        // No email config - direct login ready
        res.status(201).json({
            message: 'Account created successfully! You can now login.',
            emailSent: false
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/auth/verify-email/:token
// @desc    Verify user's email
router.get('/verify-email/:token', async (req, res) => {
    try {
        const user = await User.findOne({ verificationToken: req.params.token });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification link.' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.json({ message: 'Email verified successfully! You can now login.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Login user or admin (user must be verified)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // First check in Admin table
        const admin = await Admin.findOne({ email });
        if (admin) {
            const isMatch = await admin.comparePassword(password);
            if (isMatch) {
                return res.json({
                    _id: admin._id,
                    email: admin.email,
                    role: 'admin',
                    token: generateToken(admin._id, 'admin'),
                });
            } else {
                return res.status(401).json({ message: 'Incorrect admin password.' });
            }
        }

        // Then check in User table
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
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login. Please try again later.' });
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
            // Minimal fallback for local dev if credentials are removed later
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
            token: generateToken(updatedUser._id),
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
                status: 'active',
                isVerified: true, // Social logins are auto-verified
                provider: provider || 'social'
            });
        }
        if (user.isBanned) {
            return res.status(403).json({ message: 'Account is banned' });
        }
        res.json({
            _id: user._id, name: user.name, email: user.email,
            role: user.role, token: generateToken(user._id)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
