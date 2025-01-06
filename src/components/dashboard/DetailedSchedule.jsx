// src/components/dashboard/DetailedSchedule.jsx
import React, { useState } from 'react';
import { Alert } from '@/components/ui/alert';
import { Calendar, Clock, Users, BookOpen, Home } from 'lucide-react';

const DetailedSchedule = ({ schedule, onClose }) => {
  const [showConflicts, setShowConflicts] = useState(false);
  const [conflicts, setConflicts] = useState([]);

  const checkForConflicts = async () => {
    try {
      const response = await fetch(`/api/schedules/conflicts/${schedule._id}`);
      const data = await response.json();
      setConflicts(data);
      setShowConflicts(true);
    } catch (error) {
      console.error('Error checking conflicts:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Schedule Details</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Main Info */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Day & Time</p>
              <p className="font-medium capitalize">{schedule.dayOfWeek}, {schedule.timeSlot}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Subject</p>
              <p className="font-medium">{schedule.subject}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-sm text-gray-500">Class Size</p>
              <p className="font-medium">{schedule.students.length} students</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Home className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">
                Room {schedule.classroom.roomNumber}, {schedule.classroom.building}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Info */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-medium mb-2">Teacher Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{schedule.teacher.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Department</p>
            <p className="font-medium">{schedule.teacher.department}</p>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Enrolled Students</h3>
        <div className="max-h-48 overflow-y-auto border rounded-lg">
          {schedule.students.map(student => (
            <div 
              key={student._id}
              className="p-3 border-b last:border-b-0 hover:bg-gray-50"
            >
              <p className="font-medium">{student.name}</p>
              <p className="text-sm text-gray-500">{student.studentId}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Conflict Check */}
      <div className="flex justify-between items-center">
        <button
          onClick={checkForConflicts}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Check for Conflicts
        </button>

        <button
          onClick={() => window.print()}
          className="text-blue-600 hover:text-blue-700"
        >
          Print Schedule
        </button>
      </div>

      {/* Conflict Alerts */}
      {showConflicts && conflicts.length > 0 && (
        <div className="mt-4 space-y-2">
          {conflicts.map((conflict, index) => (
            <Alert key={index} variant="destructive">
              <p>{conflict.message}</p>
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetailedSchedule;