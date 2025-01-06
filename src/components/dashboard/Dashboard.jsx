import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2 } from 'lucide-react';


const Dashboard = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState('Fall 2024');
  const [selectedDivision, setSelectedDivision] = useState('all');
  const [divisions, setDivisions] = useState([]);
  const [error, setError] = useState(null);

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

  useEffect(() => {
    fetchDivisions();
    fetchSchedules();
  }, [selectedSemester, selectedDivision]);

  const fetchDivisions = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/divisions');
      if (!response.ok) throw new Error('Failed to fetch divisions');
      const data = await response.json();
      setDivisions(data);
    } catch (error) {
      setError('Error loading divisions: ' + error.message);
      console.error('Error fetching divisions:', error);
    }
  };

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5001/api/schedules/semester/${selectedSemester}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch schedules');
      }
      
      const data = await response.json();
      console.log('Fetched schedules:', data); // Debug log
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid schedule data received');
      }
      
      setSchedules(data);
      setError(null);
    } catch (error) {
      setError('Error loading schedules: ' + error.message);
      console.error('Error fetching schedules:', error);
      setSchedules([]); // Reset schedules on error
    } finally {
      setLoading(false);
    }
  };

  const generateNewSchedule = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/schedules/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ semester: selectedSemester })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate schedule');
      }

      await fetchSchedules();
      setError(null);
    } catch (error) {
      setError('Error generating schedule: ' + error.message);
      console.error('Error generating schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScheduleForSlot = (day, time) => {
    return schedules.filter(schedule => 
      schedule.dayOfWeek === day && 
      schedule.timeSlot === time &&
      (selectedDivision === 'all' || schedule.division.name === selectedDivision)
    );
  };

  const renderScheduleCell = (schedules) => {
    if (!schedules || schedules.length === 0) {
      return <div className="h-full border border-gray-200 bg-gray-50"></div>;
    }

    return (
      <div className="h-full space-y-2">
        {schedules.map((schedule, index) => (
          <div 
            key={`${schedule._id}-${index}`}
            className="p-2 bg-blue-100 rounded shadow-sm hover:bg-blue-200 transition-colors"
          >
            <p className="font-medium text-sm truncate">{schedule.subject}</p>
            <p className="text-xs truncate">
              Teacher: {schedule.teacher?.name || 'N/A'}
            </p>
            <p className="text-xs truncate">
              Room: {schedule.classroom?.roomNumber || 'N/A'}
            </p>
            <p className="text-xs text-gray-600 truncate">
              Division: {schedule.division?.name || 'N/A'}
            </p>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="ml-2">Loading schedules...</p>
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
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
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
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            className="rounded-md border border-gray-300 p-2"
          >
            <option value="all">All Divisions</option>
            {divisions.map(division => (
              <option key={division._id} value={division.name}>
                {division.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Schedule Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Timetable View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-max">
              <div className="grid grid-cols-6 gap-4 pb-4 border-b">
                <div className="font-medium px-4">Time</div>
                {weekDays.map(day => (
                  <div key={day} className="font-medium capitalize px-4">{day}</div>
                ))}
              </div>

              <div className="space-y-1">
                {timeSlots.map(timeSlot => (
                  <div key={timeSlot} className="grid grid-cols-6 gap-4 py-4 border-b last:border-b-0">
                    <div className="font-medium px-4">{timeSlot}</div>
                    {weekDays.map(day => (
                      <div key={`${day}-${timeSlot}`} className="px-4 min-h-[100px]">
                        {renderScheduleCell(getScheduleForSlot(day, timeSlot))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">{schedules.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">
              {new Set(schedules.map(s => s.teacher?._id)).size}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Utilized Classrooms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">
              {new Set(schedules.map(s => s.classroom?._id)).size}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;