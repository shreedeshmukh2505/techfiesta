// src/components/forms/TeacherForm.jsx
import React, { useState } from 'react';

const TeacherForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    subjects: [],
    availability: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: []
    },
    preferences: {
      maxClassesPerDay: 4,
      preferredTimeSlots: [],
      breakTime: '12:00 PM'
    }
  });

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  const departments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'English'];
  const subjects = {
    'Computer Science': ['Programming', 'Database', 'Networking', 'AI'],
    'Mathematics': ['Calculus', 'Algebra', 'Statistics'],
    'Physics': ['Mechanics', 'Electromagnetism', 'Quantum Physics'],
    'Chemistry': ['Organic', 'Inorganic', 'Physical Chemistry'],
    'English': ['Literature', 'Grammar', 'Communication']
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubjectsChange = (e) => {
    const selectedSubjects = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      subjects: selectedSubjects
    }));
  };

  const handleAvailabilityChange = (day, time) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: prev.availability[day].includes(time)
          ? prev.availability[day].filter(t => t !== time)
          : [...prev.availability[day], time]
      }
    }));
  };

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/teachers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
  
      const data = await response.json();
  
      if (data.message?.includes('duplicate key error')) {
        if (data.message.includes('email')) {
          alert('Email already registered. Please use a different email.');
        }
        return;
      }
  
      if (!response.ok) {
        throw new Error(data.message);
      }
  
      alert('Teacher registered successfully!');
      setFormData({
        name: '',
        email: '',
        department: '',
        subjects: [],
        availability: {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: []
        },
        preferences: {
          maxClassesPerDay: 4,
          preferredTimeSlots: [],
          breakTime: '12:00 PM'
        }
      });
  
    } catch (error) {
      alert('Error registering teacher: ' + error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Teacher Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          {formData.department && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Subjects</label>
              <select
                multiple
                name="subjects"
                value={formData.subjects}
                onChange={handleSubjectsChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                required
              >
                {subjects[formData.department].map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Preferences</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Maximum Classes Per Day
            </label>
            <input
              type="number"
              name="maxClassesPerDay"
              value={formData.preferences.maxClassesPerDay}
              onChange={handlePreferenceChange}
              min="1"
              max="8"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Break Time
            </label>
            <select
              name="breakTime"
              value={formData.preferences.breakTime}
              onChange={handlePreferenceChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            >
              {timeSlots.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Availability Grid */}
        <div>
          <h3 className="text-lg font-medium mb-4">Availability</h3>
          <div className="grid grid-cols-6 gap-4">
            <div></div>
            {Object.keys(formData.availability).map(day => (
              <div key={day} className="text-center font-medium capitalize">
                {day}
              </div>
            ))}
            
            {timeSlots.map(time => (
              <React.Fragment key={time}>
                <div className="text-right">{time}</div>
                {Object.keys(formData.availability).map(day => (
                  <div key={`${day}-${time}`} className="text-center">
                    <input
                      type="checkbox"
                      checked={formData.availability[day].includes(time)}
                      onChange={() => handleAvailabilityChange(day, time)}
                      className="h-4 w-4"
                    />
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default TeacherForm;