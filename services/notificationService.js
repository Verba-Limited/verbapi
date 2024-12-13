const amqp = require('amqplib/callback_api');
const emailService = require('./emailService'); // For sending email notifications

exports.notifyTransaction = async (transactionDetails) => {
  amqp.connect(process.env.RABBITMQ_URL, (err, connection) => {
    if (err) throw err;
    connection.createChannel((err, channel) => {
      if (err) throw err;
      const queue = 'transaction_notifications';

      channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(transactionDetails)));

      console.log('Transaction notification sent to queue');
    });
  });
};

// Background Worker to Process the Notification
exports.processTransactionNotification = async () => {
  amqp.connect(process.env.RABBITMQ_URL, (err, connection) => {
    if (err) throw err;
    connection.createChannel((err, channel) => {
      if (err) throw err;
      const queue = 'transaction_notifications';

      channel.assertQueue(queue, { durable: true });
      channel.consume(queue, (msg) => {
        const transactionDetails = JSON.parse(msg.content.toString());
        emailService.sendMail(transactionDetails.email, 'Transaction Alert', `Transaction of amount ${transactionDetails.amount} completed`);
        channel.ack(msg); // Acknowledge message processing
      });
    });
  });
};
