const Transaction = require('../models/Transaction');

exports.calculateMonthlyBudget = async (userId) => {
  const currentMonth = new Date().getMonth();
  const transactions = await Transaction.find({
    userId,
    createdAt: { $gte: new Date(new Date().setDate(1)) }, // All transactions from this month
  });

  const totalSpent = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  return { totalSpent, advice: getFinancialAdvice(totalSpent) };
};

const getFinancialAdvice = (totalSpent) => {
  if (totalSpent > 100000) { // Example threshold
    return "You’ve exceeded your budget for this month. Consider reducing unnecessary expenses.";
  }
  return "Your spending is within limits. Keep it up!";
};
