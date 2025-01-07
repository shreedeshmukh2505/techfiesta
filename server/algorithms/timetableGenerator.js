const axios = require('axios');

exports.generateTimetable = async ({ divisions, teachers, classrooms, semester }) => {
  try {
    console.log('Sending request to Python Flask server...');
    console.log('Input data:', {
      divisionsCount: divisions.length,
      teachersCount: teachers.length,
      classroomsCount: classrooms.length,
      semester
    });

    const response = await axios.post('http://localhost:5002/generate-timetable', {
      divisions,
      teachers,
      classrooms,
      semester
    });

    console.log('Received response from Flask server');

    if (!response.data || response.data.error) {
      throw new Error(response.data.error || 'Invalid response from server');
    }

    // Transform the schedule to match database schema
    const transformedSchedule = response.data.map(entry => {
      const division = divisions.find(d => d.name === entry.division);
      const teacher = teachers.find(t => t.name === entry.teacher);
      const classroom = classrooms.find(c => c.roomNumber === entry.room);

      if (!division || !teacher || !classroom) {
        console.warn('Missing reference for entry:', entry);
        return null;
      }

      return {
        division,
        teacher,
        classroom,
        subject: entry.course,
        day: entry.day.toLowerCase(),
        time: entry.time
      };
    }).filter(Boolean);

    console.log(`Transformed ${transformedSchedule.length} schedule entries`);
    return transformedSchedule;

  } catch (error) {
    console.error('Error in timetable generation:', error);
    throw error;
  }
}; 