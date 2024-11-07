// routes/leaveRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Route to handle user registration
router.post('/register', async (req, res) => {
    const { username, email, rollNumber, casualLeave = 0, medicalLeave = 0 } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Create a new user
        const newUser = new User({
            username,
            email,
            rollNumber,
            casualLeave,
            medicalLeave
        });

        await newUser.save();
        res.status(201).json({
            message: 'User created successfully',
            userId: newUser._id,
            username: newUser.username,
            rollNumber: newUser.rollNumber,
            casualLeave: newUser.casualLeave,
            medicalLeave: newUser.medicalLeave
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to handle user login
router.post('/login', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return user details and leave balance
        res.json({
            message: 'Login successful',
            userId: user._id,
            username: user.username,
            rollNumber: user.rollNumber,
            casualLeave: user.casualLeave,
            medicalLeave: user.medicalLeave
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Route to get leave balance by user ID
router.get('/leave-balance/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            casualLeave: user.casualLeave,
            medicalLeave: user.medicalLeave
        });
    } catch (error) {
        console.error('Error fetching leave balance:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to apply for leave (ADD leave days instead of reducing them)
router.post('/apply-leave/:id', async (req, res) => {
    const { type, days } = req.body;

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Ensure days is a number
        const leaveDays = parseInt(days);
        if (isNaN(leaveDays) || leaveDays <= 0) {
            return res.status(400).json({ message: 'Invalid number of days' });
        }

        // Add leave days instead of reducing them
        if (type === 'casual') {
            user.casualLeave += leaveDays;
        } else if (type === 'medical') {
            user.medicalLeave += leaveDays;
        } else {
            return res.status(400).json({ message: 'Invalid leave type' });
        }

        await user.save();
        res.json({
            message: 'Leave added successfully',
            casualLeave: user.casualLeave,
            medicalLeave: user.medicalLeave
        });
    } catch (error) {
        console.error('Error adding leave:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
