const AGADRScheduler = require('../services/AGADRScheduler');
const Division = require('../models/Division');
const Teacher = require('../models/Teacher');
const Classroom = require('../models/Classroom');
const Schedule = require('../models/Schedule');

exports.generateSchedule = async (req, res) => {
  try {
    const { semester } = req.body;
    console.log('Starting schedule generation for semester:', semester);
    
    // Fetch all required data with proper population
    const divisions = await Division.find({ semester }).lean();
    const teachers = await Teacher.find().lean();
    const classrooms = await Classroom.find().lean();

    if (!divisions.length) {
      throw new Error('No divisions found for the selected semester');
    }

    const scheduler = new AGADRScheduler();
    const generatedSchedule = await scheduler.generateTimetable(divisions, teachers, classrooms);

    // Clear existing schedules for the semester
    await Schedule.deleteMany({ semester });
    console.log('Cleared existing schedules');
    
    // Save new schedule to database
    const schedulePromises = generatedSchedule.map(entry => {
      const division = divisions.find(d => d.name === entry.division);
      const teacher = teachers.find(t => t.name === entry.teacher);
      const classroom = classrooms.find(c => c.roomNumber === entry.classroom);

      if (!division || !teacher || !classroom) {
        console.warn('Missing reference:', { entry, division, teacher, classroom });
        return null;
      }

      const schedule = new Schedule({
        division: division._id,
        teacher: teacher._id,
        classroom: classroom._id,
        subject: entry.subject,
        dayOfWeek: entry.dayOfWeek,
        timeSlot: entry.timeSlot,
        semester,
        scheduleType: 'division'
      });
      return schedule.save();
    });
    
    const savedSchedules = await Promise.all(schedulePromises.filter(Boolean));
    console.log(`Saved ${savedSchedules.length} schedules`);

    // Fetch the saved schedules with populated data
    const populatedSchedules = await Schedule.find({ semester })
      .populate('division')
      .populate('teacher')
      .populate('classroom')
      .lean();
    
    res.json({ 
      message: 'Schedule generated successfully',
      schedule: populatedSchedules,
      savedCount: savedSchedules.length
    });
  } catch (error) {
    console.error('Schedule generation error:', error);
    res.status(500).json({ 
      message: 'Error generating schedule', 
      error: error.message,
      details: error.stack
    });
  }
}; 