const cron = require('node-cron');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const emailService = require('../services/emailService');

const redisClient = require('../config/redis');

// Function to process postponed money requests
const processPostponedMoneyRequests = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);  // Ensure we only check for today's postponed requests

  // Find all transactions that are postponed and due today
  const transactions = await Transaction.find({
    status: 'postponed',
    postponedDate: { $lte: today },
  });

  // Loop through each postponed transaction and process it
  for (const transaction of transactions) {
    const recipient = await User.findById(transaction.recipientId);
    const sender = await User.findById(transaction.userId);

    if (recipient.balance >= transaction.amount) {
      // Transfer the money
      recipient.balance -= transaction.amount;
      sender.balance += transaction.amount;

      await recipient.save();
      await sender.save();

      // Update transaction status to completed
      transaction.status = 'completed';
      await transaction.save();


      await redisClient.set(`balance_${sender.id}`, sender.balance, 'EX', 60 * 5);
      await redisClient.set(`balance_${transaction.recipientId}`, recipient.balance, 'EX', 60 * 5);

      // Notify both parties
      await emailService.sendMail(sender.email, 'Money Request Accepted', `Your request for ${transaction.amount} has been fulfilled.`);
      await emailService.sendMail(recipient.email, 'Money Request Processed', `Your postponed request has been automatically processed.`);
    } else {
      // Notify recipient about insufficient funds
      await emailService.sendMail(recipient.email, 'Money Request Processing Failed', `Your balance was insufficient to fulfill the postponed request for ${transaction.amount}.`);
    }
  }
};

// Schedule the cron job to run daily at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily postponed money request check');
  await processPostponedMoneyRequests();
});
