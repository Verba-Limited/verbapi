const cron = require('node-cron');
const Bill = require('../models/Bill');
const emailService = require('../services/emailService');
const User = require('../models/User');

// Function to check and send reminders for upcoming bills
const sendBillReminders = async () => {
  const today = new Date();
  const reminderDate = new Date(today);
  reminderDate.setDate(today.getDate() + 3); // Check for bills due in 3 days

  // Find all bills that are pending and due in 3 days, but reminder not sent
  const bills = await Bill.find({
    status: 'pending',
    dueDate: { $lte: reminderDate },
    reminderSent: false,
  });

  // Loop through bills and send reminders
  for (const bill of bills) {
    const user = await User.findById(bill.userId);
    const message = `Reminder: Your bill of amount ${bill.amount} is due on ${bill.dueDate}. Please pay it soon to avoid penalties.`;
    
    // Send email reminder
    await emailService.sendMail(user.email, 'Bill Reminder', message);
    
    // Mark reminder as sent
    bill.reminderSent = true;
    await bill.save();
  }
};

// Schedule the cron job to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily bill reminder job');
  await sendBillReminders();
});
