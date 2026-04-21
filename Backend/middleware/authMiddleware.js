const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_fittrack_secret_key');

            // Find user in both collections
            let person = await User.findById(decoded.id).select('-password');
            if (!person) {
                person = await Admin.findById(decoded.id).select('-password');
            }

            if (!person) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            req.user = person;
            return next();
        } catch (error) {
            console.error("Token verification error:", error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, adminOnly };
