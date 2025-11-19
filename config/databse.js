const express = require('express');
const mongoose = require('mongoose');
const env = require('dotenv')

env.config()
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1); // stop app if connection fails
    }
};

module.exports = connectDb;