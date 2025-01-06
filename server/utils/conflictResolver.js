// server/utils/conflictResolver.js
const Schedule = require('../models/Schedule');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Classroom = require('../models/Classroom');

class ConflictResolver {
  async checkConflicts(scheduleId) {
    try {
      const schedule = await Schedule.findById(scheduleId)
        .populate('teacher')
        .populate('classroom')
        .populate('students');

      if (!schedule) {
        throw new Error('Schedule not found');
      }

      const conflicts = [];

      // 1. Check teacher conflicts
      const teacherConflicts = await this.checkTeacherConflicts(schedule);
      conflicts.push(...teacherConflicts);

      // 2. Check classroom conflicts
      const classroomConflicts = await this.checkClassroomConflicts(schedule);
      conflicts.push(...classroomConflicts);

      // 3. Check student conflicts
      const studentConflicts = await this.checkStudentConflicts(schedule);
      conflicts.push(...studentConflicts);

      // 4. Check capacity constraints
      const capacityConflicts = this.checkCapacityConflicts(schedule);
      if (capacityConflicts) conflicts.push(capacityConflicts);

      // 5. Check time constraints
      const timeConflicts = await this.checkTimeConstraints(schedule);
      conflicts.push(...timeConflicts);

      return conflicts;
    } catch (error) {
      console.error('Error checking conflicts:', error);
      throw error;
    }
  }

  async checkTeacherConflicts(schedule) {
    const conflicts = [];
    
    // Check other classes at the same time
    const overlappingSchedules = await Schedule.find({
      _id: { $ne: schedule._id },
      teacher: schedule.teacher._id,
      dayOfWeek: schedule.dayOfWeek,
      timeSlot: schedule.timeSlot
    });

    if (overlappingSchedules.length > 0) {
      conflicts.push({
        type: 'TEACHER_OVERLAP',
        message: `Teacher ${schedule.teacher.name} is already scheduled for this time slot`
      });
    }

    // Check teacher's availability
    if (!schedule.teacher.availability[schedule.dayOfWeek].includes(schedule.timeSlot)) {
      conflicts.push({
        type: 'TEACHER_UNAVAILABLE',
        message: `Teacher ${schedule.teacher.name} is not available at this time`
      });
    }

    // Check maximum classes per day
    const dailyClasses = await Schedule.countDocuments({
      teacher: schedule.teacher._id,
      dayOfWeek: schedule.dayOfWeek
    });

    if (dailyClasses > schedule.teacher.preferences.maxClassesPerDay) {
      conflicts.push({
        type: 'MAX_CLASSES_EXCEEDED',
        message: `Maximum daily classes exceeded for teacher ${schedule.teacher.name}`
      });
    }

    return conflicts;
  }

  async checkClassroomConflicts(schedule) {
    const conflicts = [];

    // Check room double-booking
    const overlappingSchedules = await Schedule.find({
      _id: { $ne: schedule._id },
      classroom: schedule.classroom._id,
      dayOfWeek: schedule.dayOfWeek,
      timeSlot: schedule.timeSlot
    });

    if (overlappingSchedules.length > 0) {
      conflicts.push({
        type: 'CLASSROOM_OVERLAP',
        message: `Classroom ${schedule.classroom.roomNumber} is already booked for this time slot`
      });
    }

    // Check room availability
    if (!schedule.classroom.availability[schedule.dayOfWeek].includes(schedule.timeSlot)) {
      conflicts.push({
        type: 'CLASSROOM_UNAVAILABLE',
        message: `Classroom ${schedule.classroom.roomNumber} is not available at this time`
      });
    }

    return conflicts;
  }

  async checkStudentConflicts(schedule) {
    const conflicts = [];

    // Check for each student
    for (const student of schedule.students) {
      // Check other classes at the same time
      const overlappingSchedules = await Schedule.find({
        _id: { $ne: schedule._id },
        students: student._id,
        dayOfWeek: schedule.dayOfWeek,
        timeSlot: schedule.timeSlot
      });

      if (overlappingSchedules.length > 0) {
        conflicts.push({
          type: 'STUDENT_OVERLAP',
          message: `Student ${student.name} has another class at this time`
        });
      }

      // Check student's availability
      if (!student.availability[schedule.dayOfWeek].includes(schedule.timeSlot)) {
        conflicts.push({
          type: 'STUDENT_UNAVAILABLE',
          message: `Student ${student.name} is not available at this time`
        });
      }
    }

    return conflicts;
  }

  checkCapacityConflicts(schedule) {
    if (schedule.students.length > schedule.classroom.capacity) {
      return {
        type: 'CAPACITY_EXCEEDED',
        message: `Class size exceeds room ${schedule.classroom.roomNumber} capacity`
      };
    }
    return null;
  }

  async checkTimeConstraints(schedule) {
    const conflicts = [];
    const { timeSlot, dayOfWeek } = schedule;

    // Check if class is scheduled during valid hours
    const validTimeSlots = [
      '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
      '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
    ];

    if (!validTimeSlots.includes(timeSlot)) {
      conflicts.push({
        type: 'INVALID_TIME',
        message: 'Class is scheduled outside of valid time slots'
      });
    }

    return conflicts;
  }

  async suggestAlternatives(schedule, conflicts) {
    const alternatives = [];

    if (conflicts.some(c => c.type === 'TEACHER_OVERLAP')) {
      // Suggest different time slots for the same teacher
      const availableSlots = await this.findAvailableTeacherSlots(schedule.teacher._id);
      alternatives.push({
        type: 'ALTERNATIVE_TIME',
        message: 'Available time slots for this teacher:',
        options: availableSlots
      });
    }

    if (conflicts.some(c => c.type === 'CLASSROOM_OVERLAP')) {
      // Suggest alternative classrooms
      const alternativeRooms = await this.findAlternativeClassrooms(
        schedule.dayOfWeek,
        schedule.timeSlot,
        schedule.students.length
      );
      alternatives.push({
        type: 'ALTERNATIVE_ROOM',
        message: 'Available classrooms for this time slot:',
        options: alternativeRooms
      });
    }

    return alternatives;
  }

  async findAvailableTeacherSlots(teacherId) {
    // Implementation to find available time slots for a teacher
    // This would check the teacher's availability and existing schedules
    // to suggest possible alternative times
  }

  async findAlternativeClassrooms(day, timeSlot, requiredCapacity) {
    // Implementation to find alternative classrooms
    // This would check classroom availability, capacity, and existing schedules
    // to suggest possible alternative rooms
  }
}

module.exports = new ConflictResolver();