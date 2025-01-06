// server/routes/schedules.js
const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const scheduler = require('../utils/scheduler');

// Generate schedule for a semester
router.post('/generate', async (req, res) => {
  try {
    const { semester } = req.body;
    if (!semester) {
      return res.status(400).json({ message: 'Semester is required' });
    }

    // Clear existing schedules for the semester
    await Schedule.deleteMany({ semester });

    // Generate new schedule
    const generatedSchedule = await scheduler.generateSchedule(semester);

    // Save all schedule entries
    const savedSchedule = await Schedule.insertMany(generatedSchedule);

    res.status(201).json(savedSchedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all schedules
router.get('/', async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate('teacher')
      .populate('classroom')
      .populate('students');
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get schedules by semester
router.get('/semester/:semester', async (req, res) => {
  try {
    const schedules = await Schedule.find({ semester: req.params.semester })
      .populate('teacher')
      .populate('classroom')
      .populate('students');
    res.json(schedules || []);
  } catch (err) {
    console.error('Error fetching schedules:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get teacher's schedule
router.get('/teacher/:teacherId', async (req, res) => {
  try {
    const schedules = await Schedule.find({ teacher: req.params.teacherId })
      .populate('classroom')
      .populate('students');
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get student's schedule
router.get('/student/:studentId', async (req, res) => {
  try {
    const schedules = await Schedule.find({ students: req.params.studentId })
      .populate('teacher')
      .populate('classroom');
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update schedule status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['scheduled', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// server/routes/schedules.js
// Add these routes to the existing schedules.js file

const conflictResolver = require('../utils/conflictResolver');

// Check conflicts for a specific schedule
router.get('/conflicts/:scheduleId', async (req, res) => {
  try {
    const conflicts = await conflictResolver.checkConflicts(req.params.scheduleId);
    res.json(conflicts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get alternative suggestions for resolving conflicts
router.get('/alternatives/:scheduleId', async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.scheduleId)
      .populate('teacher')
      .populate('classroom')
      .populate('students');

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    const conflicts = await conflictResolver.checkConflicts(req.params.scheduleId);
    const alternatives = await conflictResolver.suggestAlternatives(schedule, conflicts);

    res.json({ conflicts, alternatives });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// In server/routes/schedules.js
router.post('/generate', async (req, res) => {
    try {
        const { semester } = req.body;
        if (!semester) {
            return res.status(400).json({ message: 'Semester is required' });
        }

        const scheduler = require('../utils/scheduler');
        const schedules = await scheduler.generateSchedule(semester);
        
        // Save the generated schedules
        const savedSchedules = await Schedule.insertMany(schedules);
        
        res.status(201).json(savedSchedules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// server/routes/schedules.js
router.post('/generate', async (req, res) => {
  try {
      const { semester } = req.body;
      
      if (!semester) {
          return res.status(400).json({ 
              success: false,
              message: 'Semester is required' 
          });
      }

      console.log('Starting schedule generation for semester:', semester);

      const scheduler = require('../utils/scheduler');
      const schedules = await scheduler.generateSchedule(semester);
      
      console.log(`Successfully generated ${schedules.length} schedules`);
      
      res.status(201).json({
          success: true,
          count: schedules.length,
          schedules: schedules
      });
  } catch (error) {
      console.error('Schedule generation failed:', error);
      res.status(500).json({ 
          success: false,
          message: 'Failed to generate schedule',
          error: error.message 
      });
  }
});
// Generate schedule for a semester
router.post('/generate', async (req, res) => {
  try {
      const { semester } = req.body;
      
      if (!semester) {
          return res.status(400).json({ 
              success: false, 
              message: 'Semester is required' 
          });
      }

      // Check if resources exist
      const [teacherCount, studentCount, classroomCount] = await Promise.all([
          Teacher.countDocuments(),
          Student.countDocuments(),
          Classroom.countDocuments()
      ]);

      if (teacherCount === 0 || studentCount === 0 || classroomCount === 0) {
          return res.status(400).json({
              success: false,
              message: 'Insufficient resources to generate schedule'
          });
      }

      // Clear existing schedules for the semester
      await Schedule.deleteMany({ semester });

      // Generate new schedule
      const generatedSchedule = await scheduler.generateSchedule(semester);

      if (!generatedSchedule || generatedSchedule.length === 0) {
          return res.status(400).json({
              success: false,
              message: 'No valid schedules could be generated'
          });
      }

      res.status(201).json({
          success: true,
          count: generatedSchedule.length,
          data: generatedSchedule
      });

  } catch (error) {
      console.error('Schedule generation error:', error);
      res.status(500).json({
          success: false,
          message: 'Internal server error during schedule generation',
          error: error.message
      });
  }
});

// Get all schedules
router.get('/', async (req, res) => {
  try {
      const schedules = await Schedule.find()
          .populate('teacher')
          .populate('classroom')
          .populate('students');
      res.json(schedules);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// Get schedules by semester
router.get('/semester/:semester', async (req, res) => {
  try {
      const schedules = await Schedule.find({ semester: req.params.semester })
          .populate('teacher')
          .populate('classroom')
          .populate('students');
      res.json(schedules);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

module.exports = router;