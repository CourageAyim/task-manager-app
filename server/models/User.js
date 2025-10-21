const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false, 
    },
    role: {
        type: String,
        enum: ['member', 'admin'], 
        default: 'member',
    },

    name: {
        type: String,
        required: true,
        trim: true,
        default: 'New User',
    },
    profileImageUrl: {
        type: String,
        default: null, 
    },
    themePreference: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light',
    },
}, { 
    timestamps: true 
});


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


const User = mongoose.model('User', userSchema);
module.exports = User;