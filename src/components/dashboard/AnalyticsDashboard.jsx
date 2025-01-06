// src/components/dashboard/AnalyticsDashboard.jsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Alert } from '../../components/ui/alert';
import { Loader2 } from 'lucide-react';

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    utilizationStats: [],
    teacherStats: [],
    studentStats: [],
    roomStats: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/dashboard');
      const analyticsData = await response.json();
      setData(analyticsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold mb-6">Schedule Analytics</h2>

      {/* Resource Utilization */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.utilizationStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="classroomUtilization" stroke="#8884d8" name="Classroom" />
                <Line type="monotone" dataKey="teacherUtilization" stroke="#82ca9d" name="Teacher" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Class Distribution by Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.teacherStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timeSlot" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="classes" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Room Capacity Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.roomStats}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  />
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Schedule Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {data.utilizationStats[0]?.efficiency || 0}%
            </div>
            <p className="text-sm text-gray-500 mt-2">Overall scheduling efficiency</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conflict Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {data.utilizationStats[0]?.conflictRate || 0}%
            </div>
            <p className="text-sm text-gray-500 mt-2">Schedule conflict rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Teacher Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {data.teacherStats[0]?.satisfaction || 0}%
            </div>
            <p className="text-sm text-gray-500 mt-2">Based on preference matching</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Insights and Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.alerts?.map((alert, index) => (
              <Alert key={index} variant={alert.type} className="flex items-center">
                <div>
                  <h4 className="font-medium">{alert.title}</h4>
                  <p className="text-sm">{alert.message}</p>
                </div>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;