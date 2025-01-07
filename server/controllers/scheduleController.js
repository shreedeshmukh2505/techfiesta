const { generateTimetable } = require('../algorithms/timetableGenerator');
const Division = require('../models/Division');
const Teacher = require('../models/Teacher');
const Classroom = require('../models/Classroom');
const Schedule = require('../models/Schedule');

exports.generateSchedule = async (req, res) => {
  try {
    const { semester } = req.body;
    console.log('Starting schedule generation for semester:', semester);
    
    // Fetch all required data
    const divisions = await Division.find({ semester }).lean();
    const teachers = await Teacher.find().lean();
    const classrooms = await Classroom.find().lean();

    console.log('Fetched data:', {
      divisionsCount: divisions.length,
      teachersCount: teachers.length,
      classroomsCount: classrooms.length
    });

    if (!divisions.length) {
      throw new Error('No divisions found for the selected semester');
    }

    // Generate schedule using Flask API
    const generatedSchedule = await generateTimetable({
      divisions,
      teachers,
      classrooms,
      semester
    });

    console.log('Schedule generated successfully');

    // Clear existing schedules
    await Schedule.deleteMany({ semester });
    console.log('Cleared existing schedules');
    
    // Save new schedules
    const schedulePromises = generatedSchedule.map(entry => {
      const schedule = new Schedule({
        division: entry.division._id,
        teacher: entry.teacher._id,
        classroom: entry.classroom._id,
        subject: entry.subject,
        dayOfWeek: entry.day,
        timeSlot: entry.time,
        semester
      });
      return schedule.save();
    });

    const savedSchedules = await Promise.all(schedulePromises);
    console.log(`Saved ${savedSchedules.length} schedules`);

    // Fetch complete schedule with populated references
    const populatedSchedules = await Schedule.find({ semester })
      .populate('division')
      .populate('teacher')
      .populate('classroom')
      .lean();

    res.json({
      message: 'Schedule generated successfully',
      schedule: populatedSchedules
    });

  } catch (error) {
    console.error('Schedule generation error:', error);
    res.status(500).json({ 
      message: 'Error generating schedule', 
      error: error.message 
    });
  }
}; 