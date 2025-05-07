// pages/student/Dashboard.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../layouts/DashboardLayout';
import { toast } from 'react-toastify';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';

const COLORS = ['#4ade80', '#f87171']; // green for complete, red for pending

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [progressData, setProgressData] = useState([]); // stores progress per course
  const [overallStats, setOverallStats] = useState({ completed: 0, pending: 0 });

  const token = JSON.parse(localStorage.getItem('learnsphere-user'))?.token;

  const fetchDashboardData = async () => {
    try {
      // Step 1: Fetch enrolled courses
      const courseRes = await axios.get('http://localhost:5000/api/students/my-courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const enrolledCourses = courseRes.data;
      setCourses(enrolledCourses);

      // Step 2: For each course → fetch sessions + completed sessions
      const progressArray = [];
      let totalSessions = 0;
      let totalCompleted = 0;

      for (const course of enrolledCourses) {
        const [sessionRes, completedRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/sessions/${course.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:5000/api/progress/completed/${course.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const sessions = sessionRes.data;
        const completed = completedRes.data;

        const numSessions = sessions.length;
        const numCompleted = completed.length;
        const percent = numSessions > 0 ? Math.round((numCompleted / numSessions) * 100) : 0;

        progressArray.push({
          courseId: course.id,
          title: course.title,
          category: course.category,
          totalSessions: numSessions,
          completedSessions: numCompleted,
          percentComplete: percent,
        });

        totalSessions += numSessions;
        totalCompleted += numCompleted;
      }

      setProgressData(progressArray);
      setOverallStats({
        completed: totalCompleted,
        pending: totalSessions - totalCompleted,
      });

    } catch (err) {
      toast.error('Failed to load dashboard data');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-4">Student Analytics Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Card 1: Enrolled Courses */}
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold text-lg mb-1">📚 Enrolled Courses</h3>
          <p className="text-3xl text-green-600 font-bold">{courses.length}</p>
        </div>

        {/* Card 2: Overall Progress */}
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold text-lg mb-1">✅ Total Sessions Completed</h3>
          <p className="text-3xl text-indigo-600 font-bold mb-1">{overallStats.completed}</p>
          <p className="text-sm text-gray-500">{overallStats.completed} completed / {(overallStats.completed + overallStats.pending)} total sessions</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold text-lg mb-4">📈 Overall Completion</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Completed', value: overallStats.completed },
                  { name: 'Pending', value: overallStats.pending },
                ]}
                cx="50%"
                cy="50%"
                label
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {[
                  { name: 'Completed', color: COLORS[0] },
                  { name: 'Pending', color: COLORS[1] },
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold text-lg mb-4">📊 Course-wise Progress (%)</h3>
          {progressData.length === 0 ? (
            <p className="text-gray-500 text-sm">No course data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={progressData}
                margin={{ top: 5, right: 20, left: 0, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" interval={0} angle={-25} textAnchor="end" height={60} />
                <YAxis unit="%" />
                <Tooltip />
                <Legend  verticalAlign="bottom" align="right" />
                <Bar dataKey="percentComplete" fill="#4ade80" name="Completion %" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
