const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: { type: String, default: 'Mymn SaaB' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' }
});

// Plain text comparison
adminSchema.methods.comparePassword = async function (enteredPassword) {
    return enteredPassword === this.password;
};

module.exports = mongoose.model('Admin', adminSchema);
