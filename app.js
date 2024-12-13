const express = require('express');
const mongoose = require('mongoose');
const redisClient = require('./config/redis');
const rabbitMQ = require('./config/rabbitmq');

// Load the bill reminder scheduler
require('./scheduler/billReminderScheduler');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const accountRoutes = require('./routes/accountRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const billRoutes = require('./routes/billRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const mfaRoutes = require('./routes/mfaRoutes');
const passwordResetRoutes = require('./routes/passwordResetRoutes');
const emailRoutes = require('./routes/emailRoutes'); 
const aiBankingRoutes = require('./routes/aiBankingRoutes'); 

const app = express();
app.use(express.json()); // Parse incoming JSON requests

app.get("/", async (req, res) => {
    res.send("Welcome to the Verb API!");
})

// Use Routes
app.use('/auth', authRoutes);
app.use('/account', accountRoutes);
app.use('/transaction', transactionRoutes);
app.use('/bills', billRoutes);
app.use('/budget', budgetRoutes);
app.use('/mfa', mfaRoutes);
app.use('/password-reset', passwordResetRoutes);
app.use('/email', emailRoutes);
app.use('/verb', aiBankingRoutes);

module.exports = app;
