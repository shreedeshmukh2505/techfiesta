// server/utils/scheduleOptimizer.js
const Schedule = require('../models/Schedule');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Classroom = require('../models/Classroom');

class ScheduleOptimizer {
  constructor() {
    this.weights = {
      teacherPreference: 0.3,
      studentAvailability: 0.3,
      roomUtilization: 0.2,
      timeDistribution: 0.2
    };
  }

  async optimizeSchedule(schedules) {
    try {
      // 1. Calculate current schedule score
      const currentScore = await this.calculateScheduleScore(schedules);

      // 2. Try optimization strategies
      const optimizedSchedules = await this.applyOptimizations(schedules);

      // 3. Calculate new score
      const newScore = await this.calculateScheduleScore(optimizedSchedules);

      return {
        originalScore: currentScore,
        optimizedScore: newScore,
        improvement: ((newScore - currentScore) / currentScore) * 100,
        schedules: optimizedSchedules
      };
    } catch (error) {
      console.error('Error optimizing schedule:', error);
      throw error;
    }
  }

  async calculateScheduleScore(schedules) {
    const scores = await Promise.all([
      this.evaluateTeacherPreferences(schedules),
      this.evaluateStudentAvailability(schedules),
      this.evaluateRoomUtilization(schedules),
      this.evaluateTimeDistribution(schedules)
    ]);

    return scores.reduce((total, score, index) => {
      const weight = Object.values(this.weights)[index];
      return total + (score * weight);
    }, 0);
  }

  async evaluateTeacherPreferences(schedules) {
    let score = 0;
    const totalSchedules = schedules.length;

    for (const schedule of schedules) {
      const teacher = await Teacher.findById(schedule.teacher);
      
      // Check if time slot is preferred
      if (teacher.preferences.preferredTimeSlots.includes(schedule.timeSlot)) {
        score += 1;
      }

      // Check daily class load
      const dailyClasses = schedules.filter(s => 
        s.teacher.equals(teacher._id) && 
        s.dayOfWeek === schedule.dayOfWeek
      ).length;

      if (dailyClasses <= teacher.preferences.maxClassesPerDay) {
        score += 1;
      }

      // Check break time respect
      if (schedule.timeSlot !== teacher.preferences.breakTime) {
        score += 1;
      }
    }

    return score / (totalSchedules * 3); // Normalize to 0-1
  }

  async evaluateStudentAvailability(schedules) {
    let score = 0;
    let totalEvaluations = 0;

    for (const schedule of schedules) {
      for (const studentId of schedule.students) {
        const student = await Student.findById(studentId);
        
        if (student.availability[schedule.dayOfWeek].includes(schedule.timeSlot)) {
          score += 1;
        }
        totalEvaluations += 1;
      }
    }

    return score / totalEvaluations;
  }

  async evaluateRoomUtilization(schedules) {
    let score = 0;
    const totalSchedules = schedules.length;

    for (const schedule of schedules) {
      const classroom = await Classroom.findById(schedule.classroom);
      const studentCount = schedule.students.length;
      
      // Optimal utilization: 70-90% of room capacity
      const utilizationRate = studentCount / classroom.capacity;
      if (utilizationRate >= 0.7 && utilizationRate <= 0.9) {
        score += 1;
      }
    }

    return score / totalSchedules;
  }

  async evaluateTimeDistribution(schedules) {
    const timeSlots = {
      '9:00 AM': 0, '10:00 AM': 0, '11:00 AM': 0, '12:00 PM': 0,
      '1:00 PM': 0, '2:00 PM': 0, '3:00 PM': 0, '4:00 PM': 0
    };

    // Count classes per time slot
    schedules.forEach(schedule => {
      timeSlots[schedule.timeSlot]++;
    });

    // Calculate standard deviation of distribution
    const values = Object.values(timeSlots);
    const mean = values.reduce((a, b) => a + b) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    // Lower standard deviation means better distribution
    return 1 - (stdDev / mean); // Normalize to 0-1
  }

  async applyOptimizations(schedules) {
    const optimizedSchedules = [...schedules];

    // 1. Balance room utilization
    await this.balanceRoomUtilization(optimizedSchedules);

    // 2. Optimize teacher schedules
    await this.optimizeTeacherSchedules(optimizedSchedules);

    // 3. Minimize student conflicts
    await this.minimizeStudentConflicts(optimizedSchedules);

    return optimizedSchedules;
  }

  async balanceRoomUtilization(schedules) {
    // Implementation of room utilization optimization
    // This would involve moving classes to more appropriately sized rooms
  }

  async optimizeTeacherSchedules(schedules) {
    // Implementation of teacher schedule optimization
    // This would involve adjusting schedules to better match teacher preferences
  }

  async minimizeStudentConflicts(schedules) {
    // Implementation of student conflict minimization
    // This would involve moving classes to reduce overlapping schedules
  }
}

module.exports = new ScheduleOptimizer();