const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');

router.post('/test-email', async (req, res) => {
  try {
    const { email, subject, message } = req.body;
    const result = await emailService.sendMail(email, subject, message);
    res.status(200).json({ message: 'Email sent successfully', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
