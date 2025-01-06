// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StudentForm from './components/forms/StudentForm';
import TeacherForm from './components/forms/TeacherForm';
import ClassroomForm from './components/forms/ClassroomForm';
import Dashboard from './components/dashboard/Dashboard';
import AnalyticsDashboard from './components/dashboard/AnalyticsDashboard';
import NotificationCenter from './components/notifications/NotificationCenter';
import DivisionForm from './components/forms/DivisionForm';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <Link to="/" className="text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
                <Link to="/student-registration" className="text-gray-700 hover:text-blue-600">
                  Register Student
                </Link>
                <Link to="/teacher-registration" className="text-gray-700 hover:text-blue-600">
                  Register Teacher
                </Link>
                <Link to="/classroom-registration" className="text-gray-700 hover:text-blue-600">
                  Register Classroom
                </Link>
                <Link to="/analytics" className="text-gray-700 hover:text-blue-600">
                  Analytics
                </Link>
                <Link to="/register/division" className="text-gray-700 hover:text-blue-600">
                  Register Division
                </Link>
              </div>
              <NotificationCenter />
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/student-registration" element={<StudentForm />} />
            <Route path="/teacher-registration" element={<TeacherForm />} />
            <Route path="/classroom-registration" element={<ClassroomForm />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/register/division" element={<DivisionForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;