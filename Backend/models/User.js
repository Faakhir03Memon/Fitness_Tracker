const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isBanned: { type: Boolean, default: false },
    status: { type: String, default: 'active' },
    role: { type: String, default: 'user' },
    provider: { type: String, default: 'email' },
    weight: { type: Number },
    height: { type: Number },
    age: { type: Number },
    gender: { type: String },
    avatar: { type: String },

    // Email Verification
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },

    // Password Reset
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    createdAt: { type: Date, default: Date.now }
});

// Plain text comparison (no hashing as per user request)
userSchema.methods.comparePassword = async function (enteredPassword) {
    return enteredPassword === this.password;
};

module.exports = mongoose.model('User', userSchema);
