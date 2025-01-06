// src/components/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { scheduleService } from '../../services/api';

const Dashboard = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState('Fall 2024');
  const [view, setView] = useState('weekly'); // weekly or daily

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

  useEffect(() => {
    fetchSchedules();
  }, [selectedSemester]);

  const generateNewSchedule = async () => {
    try {
      setLoading(true);
      await scheduleService.generateSchedule(selectedSemester);
      await fetchSchedules(); // Refresh the schedule display
      setLoading(false);
    } catch (error) {
      console.error('Error generating schedule:', error);
      setLoading(false);
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/schedules/semester/${selectedSemester}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSchedules(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setSchedules([]);
      setLoading(false);
    }
  };

  const getScheduleForSlot = (day, timeSlot) => {
    return schedules.find(schedule => 
      schedule.dayOfWeek === day && 
      schedule.timeSlot === timeSlot
    );
  };

  const renderScheduleCell = (schedule) => {
    if (!schedule) return null;

    return (
      <div className="p-2 bg-blue-100 rounded shadow-sm">
        <p className="font-medium text-sm">{schedule.subject}</p>
        <p className="text-xs">{schedule.teacher.name}</p>
        <p className="text-xs">Room {schedule.classroom.roomNumber}</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading schedules...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Class Schedule</h1>
        
        <div className="flex space-x-4">
        <button
  onClick={generateNewSchedule}
  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  disabled={loading}
>
  {loading ? 'Generating...' : 'Generate Schedule'}
</button>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="rounded-md border border-gray-300 p-2"
          >
            <option value="Fall 2024">Fall 2024</option>
            <option value="Spring 2025">Spring 2025</option>
          </select>

          <select
            value={view}
            onChange={(e) => setView(e.target.value)}
            className="rounded-md border border-gray-300 p-2"
          >
            <option value="weekly">Weekly View</option>
            <option value="daily">Daily View</option>
          </select>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-max">
          <div className="grid grid-cols-6 gap-4 bg-gray-50 p-4 rounded-t-lg">
            <div className="font-medium">Time</div>
            {weekDays.map(day => (
              <div key={day} className="font-medium capitalize">
                {day}
              </div>
            ))}
          </div>

          {timeSlots.map(timeSlot => (
            <div key={timeSlot} className="grid grid-cols-6 gap-4 border-b p-4">
              <div className="font-medium">{timeSlot}</div>
              {weekDays.map(day => (
                <div key={`${day}-${timeSlot}`}>
                  {renderScheduleCell(getScheduleForSlot(day, timeSlot))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Summary Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium mb-2">Total Classes</h3>
          <p className="text-2xl">{schedules.length}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium mb-2">Active Teachers</h3>
          <p className="text-2xl">
            {new Set(schedules.map(s => s.teacher._id)).size}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium mb-2">Utilized Classrooms</h3>
          <p className="text-2xl">
            {new Set(schedules.map(s => s.classroom._id)).size}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;