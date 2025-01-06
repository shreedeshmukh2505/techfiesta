const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.post('/generate', scheduleController.generateSchedule);
// Other existing routes...

module.exports = router; 