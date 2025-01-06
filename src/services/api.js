// src/services/api.js
const API_URL = 'http://localhost:5001/api';

export const scheduleService = {
  // Generate schedule
  generateSchedule: async (semester) => {
    try {
      const response = await fetch(`${API_URL}/schedules/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ semester }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error generating schedule:', error);
      throw error;
    }
  },

  // Get generated schedule
  getSchedule: async (semester) => {
    try {
      const response = await fetch(`${API_URL}/schedules/semester/${semester}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching schedule:', error);
      throw error;
    }
  }
};

export const studentService = {
  // Add student
  addStudent: async (studentData) => {
    try {
      const response = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  }
};

export const teacherService = {
  // Add teacher
  addTeacher: async (teacherData) => {
    try {
      const response = await fetch(`${API_URL}/teachers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teacherData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error adding teacher:', error);
      throw error;
    }
  }
};

export const classroomService = {
  // Add classroom
  addClassroom: async (classroomData) => {
    try {
      const response = await fetch(`${API_URL}/classrooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(classroomData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error adding classroom:', error);
      throw error;
    }
  }
};