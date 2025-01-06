// server/services/analyticsService.js
const Schedule = require('../models/Schedule');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Classroom = require('../models/Classroom');

class AnalyticsService {
  async getDashboardData() {
    try {
      const [
        utilizationStats,
        teacherStats,
        studentStats,
        roomStats,
        alerts
      ] = await Promise.all([
        this.getUtilizationStats(),
        this.getTeacherStats(),
        this.getStudentStats(),
        this.getRoomStats(),
        this.generateInsights()
      ]);

      return {
        utilizationStats,
        teacherStats,
        studentStats,
        roomStats,
        alerts
      };
    } catch (error) {
      console.error('Error generating analytics:', error);
      throw error;
    }
  }

  async getUtilizationStats() {
    const schedules = await Schedule.find().populate('classroom').populate('teacher');
    const totalTimeSlots = 8 * 5; // 8 slots per day, 5 days
    const stats = [];

    // Calculate weekly statistics
    const weeklyData = this.groupByWeek(schedules);
    for (const [week, weekSchedules] of weeklyData) {
      const classroomUtilization = this.calculateClassroomUtilization(weekSchedules);
      const teacherUtilization = this.calculateTeacherUtilization(weekSchedules);
      const efficiency = this.calculateScheduleEfficiency(weekSchedules);
      const conflictRate = await this.calculateConflictRate(weekSchedules);

      stats.push({
        week,
        classroomUtilization,
        teacherUtilization,
        efficiency,
        conflictRate
      });
    }

    return stats;
  }

  async getTeacherStats() {
    const teachers = await Teacher.find();
    const schedules = await Schedule.find().populate('teacher');
    
    return {
      timeSlotDistribution: this.calculateTimeSlotDistribution(schedules),
      satisfactionRate: await this.calculateTeacherSatisfaction(teachers, schedules),
      loadDistribution: this.calculateTeacherLoadDistribution(schedules)
    };
  }

  async getStudentStats() {
    const students = await Student.find();
    const schedules = await Schedule.find().populate('students');

    return {
      averageClassSize: this.calculateAverageClassSize(schedules),
      courseDistribution: this.calculateCourseDistribution(schedules),
      timeSlotPreferences: await this.analyzeStudentPreferences(students, schedules)
    };
  }

  async getRoomStats() {
    const classrooms = await Classroom.find();
    const schedules = await Schedule.find().populate('classroom');

    return {
      capacityUtilization: this.calculateRoomCapacityUtilization(classrooms, schedules),
      facilityUsage: this.analyzeFacilityUsage(classrooms, schedules),
      roomPreferences: this.analyzeRoomPreferences(schedules)
    };
  }

  async generateInsights() {
    const alerts = [];
    const schedules = await Schedule.find()
      .populate('teacher')
      .populate('classroom')
      .populate('students');

    // Check for underutilized rooms
    const roomUtilization = await this.getRoomStats();
    const underutilizedRooms = roomUtilization.capacityUtilization.filter(r => r.value < 50);
    if (underutilizedRooms.length > 0) {
      alerts.push({
        type: 'warning',
        title: 'Room Utilization Alert',
        message: `${underutilizedRooms.length} rooms are under 50% capacity utilization`
      });
    }

    // Check for teacher workload imbalance
    const teacherStats = await this.getTeacherStats();
    const workloadVariance = this.calculateWorkloadVariance(teacherStats.loadDistribution);
    if (workloadVariance > 0.2) { // 20% variance threshold
      alerts.push({
        type: 'warning',
        title: 'Teacher Workload Imbalance',
        message: 'Significant variation in teacher workload distribution detected'
      });
    }

    // Generate optimization recommendations
    const recommendations = await this.generateOptimizationRecommendations(schedules);
    alerts.push(...recommendations);

    return alerts;
  }

  // Helper methods
  groupByWeek(schedules) {
    // Group schedules by week logic
    const weeklyData = new Map();
    // Implementation details...
    return weeklyData;
  }

  calculateClassroomUtilization(schedules) {
    // Calculate percentage of available classroom time slots being used
    // Implementation details...
  }

  calculateTeacherUtilization(schedules) {
    // Calculate percentage of teacher availability being utilized
    // Implementation details...
  }

  calculateScheduleEfficiency(schedules) {
    // Calculate overall schedule efficiency based on various metrics
    // Implementation details...
  }

  async calculateConflictRate(schedules) {
    // Calculate percentage of schedules with conflicts
    // Implementation details...
  }

  calculateTimeSlotDistribution(schedules) {
    // Calculate distribution of classes across different time slots
    // Implementation details...
  }

  async calculateTeacherSatisfaction(teachers, schedules) {
    // Calculate teacher satisfaction based on preference matching
    // Implementation details...
  }

  async generateOptimizationRecommendations(schedules) {
    // Generate recommendations for schedule optimization
    // Implementation details...
  }
}

module.exports = new AnalyticsService();