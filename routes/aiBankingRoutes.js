const express = require('express');
const router = express.Router();

const aiController = require('../controllers/aiBankingController');

router.post('/prompt', aiController.aiBankingController);

module.exports = router;
