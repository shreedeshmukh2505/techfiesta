// server/routes/schedules.js
const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const scheduleController = require('../controllers/scheduleController');

// Get schedules for a semester
router.get('/semester/:semester', async (req, res) => {
  try {
    const schedules = await Schedule.find({ semester: req.params.semester })
      .populate('division')
      .populate('teacher')
      .populate('classroom')
      .lean();
    
    console.log('Fetched schedules:', schedules.length);
    res.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ message: error.message });
  }
});

// Generate schedule
router.post('/generate', scheduleController.generateSchedule);

module.exports = router;