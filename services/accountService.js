const User = require('../models/User');
const redisClient = require('../config/redis');

exports.getAccountBalance = async (userId) => {
  // Check if balance is cached
  const cachedBalance = await redisClient.get(`balance_${userId}`);
  console.log("cachedBalance: " + cachedBalance);
  if (cachedBalance) {
    return { balance: cachedBalance };
  }
  // If not cached, fetch from the database
  const user = await User.findById(userId).select('balance');
  if (!user) {
    throw new Error('User not found');
  }
  // Cache balance for future requests
  await redisClient.set(`balance_${userId}`, user.balance, 'EX', 60 * 5); // Cache for 5 minutes
  return { balance: user.balance };
};

exports.updateAccountBalance = async (userId, amount, type = 'credit') => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  if (type === 'credit') {
    user.balance += amount;
  } else if (type === 'debit') {
    if (user.balance < amount) throw new Error('Insufficient balance');
    user.balance -= amount;
  } else {
    throw new Error('Invalid transaction type');
  }

  await user.save();
  return { balance: user.balance };
};
