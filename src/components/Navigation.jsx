import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Timetable Manager</Link>
        <div className="space-x-4">
          <Link to="/register/student" className="hover:text-gray-300">Register Student</Link>
          <Link to="/register/teacher" className="hover:text-gray-300">Register Teacher</Link>
          <Link to="/register/classroom" className="hover:text-gray-300">Register Classroom</Link>
          <Link to="/register/division" className="hover:text-gray-300">Register Division</Link>
          <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 