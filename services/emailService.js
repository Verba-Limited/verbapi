const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// Create reusable transporter object using SMTP transport
// const transporter = nodemailer.createTransport({
//   service: 'gmail', // You can use Gmail, Mailgun, SendGrid, etc.
//   host: 'smtp.gmail.com',
//   port: 456,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_USERNAME, // Your email address
//     pass: process.env.EMAIL_PASSWORD, // Your email password or App-specific password
//   },
// });

const transporter = nodemailer.createTransport({
  host: process.env.ELASTICMAIL_HOST,
  port: 2525,
  auth: {
      user: process.env.ELASTICMAIL_USER,
      pass: process.env.ELASTICMAIL_PASSWORD,
  },
});

exports.sendMail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      // from: process.env.EMAIL_USERNAME,
      from: process.env.ELASTICMAIL_SENDER,
      to,
      subject,
      text, // Plain text content
      html, // HTML content
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// const transporter = nodemailer.createTransport({
//   host: 'smtp.sendgrid.net',
//   port: 587,
//   auth: {
//     user: 'apikey', // This is the SendGrid API key
//     pass: process.env.SENDGRID_API_KEY,
//   },
// });

// A function to send email
// exports.sendMail = async (to, subject, text) => {
//   try {
//     const mailOptions = {
//       from: process.env.EMAIL_USERNAME, // sender address
//       to, // recipient address
//       subject, // subject line
//       text, // plain text body
//     };

//     // Send email using the transporter
//     const info = await transporter.sendMail(mailOptions);
//     console.log('Email sent: ' + info.response);
//     return info;
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw error;
//   }
// };
