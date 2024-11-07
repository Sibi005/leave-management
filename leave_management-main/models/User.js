// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    rollNumber: {
        type: String,
        required: true
    },
    casualLeave: {
        type: Number,
        default: 10 // default leave balance
    },
    medicalLeave: {
        type: Number,
        default: 10 // default leave balance
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
