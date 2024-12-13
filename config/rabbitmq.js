const amqp = require('amqplib/callback_api');

amqp.connect(process.env.RABBITMQ_URL, (err, connection) => {
  if (err) throw err;
  connection.createChannel((error, channel) => {
    if (error) throw error;
    console.log('RabbitMQ connected');
  });
});
