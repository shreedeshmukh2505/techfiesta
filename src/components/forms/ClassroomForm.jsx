// src/components/forms/ClassroomForm.jsx
import React, { useState } from 'react';

const ClassroomForm = () => {
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  const buildings = ['Main Building', 'Science Block', 'Engineering Block', 'Library Block'];
  
  const facilityOptions = [
    'Projector',
    'Whiteboard',
    'Computer Lab',
    'Smart Board',
    'Audio System',
    'Air Conditioning'
  ];

  const [formData, setFormData] = useState({
    roomNumber: '',
    building: '',
    floor: '',
    capacity: 30,
    facilities: [],
    availability: {
      monday: [...timeSlots],
      tuesday: [...timeSlots],
      wednesday: [...timeSlots],
      thursday: [...timeSlots],
      friday: [...timeSlots]
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFacilityChange = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/classrooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
  
      const data = await response.json();
  
      if (data.message?.includes('duplicate key error')) {
        if (data.message.includes('roomNumber')) {
          alert('Room number already exists. Please use a different number.');
        }
        return;
      }
  
      if (!response.ok) {
        throw new Error(data.message);
      }
  
      alert('Classroom registered successfully!');
      setFormData({
        roomNumber: '',
        building: '',
        floor: '',
        capacity: 30,
        facilities: [],
        availability: {
          monday: [...timeSlots],
          tuesday: [...timeSlots],
          wednesday: [...timeSlots],
          thursday: [...timeSlots],
          friday: [...timeSlots]
        }
      });
  
    } catch (error) {
      alert('Error registering classroom: ' + error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Classroom Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Room Number</label>
            <input
              type="text"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Building</label>
            <select
              name="building"
              value={formData.building}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            >
              <option value="">Select Building</option>
              {buildings.map(building => (
                <option key={building} value={building}>{building}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Floor</label>
            <input
              type="number"
              name="floor"
              value={formData.floor}
              onChange={handleInputChange}
              min="0"
              max="10"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Capacity</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              min="10"
              max="200"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            />
          </div>
        </div>

        {/* Facilities */}
        <div>
          <h3 className="text-lg font-medium mb-3">Facilities</h3>
          <div className="grid grid-cols-2 gap-4">
            {facilityOptions.map(facility => (
              <div key={facility} className="flex items-center">
                <input
                  type="checkbox"
                  id={facility}
                  checked={formData.facilities.includes(facility)}
                  onChange={() => handleFacilityChange(facility)}
                  className="h-4 w-4 text-blue-600"
                />
                <label htmlFor={facility} className="ml-2 text-sm text-gray-700">
                  {facility}
                </label>
              </div>
            ))}
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
          Register Classroom
        </button>
      </form>
    </div>
  );
};

export default ClassroomForm;