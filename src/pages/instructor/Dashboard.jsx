import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['#4CAF50', '#FF9800', '#2196F3', '#9C27B0', '#FFC107'];

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);

  const token = JSON.parse(localStorage.getItem('learnsphere-user'))?.token;

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/courses/my-courses-with-enrollments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(res.data);
      setCourses(res.data);
    } catch (err) {
      toast.error('Failed to load courses');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ---- Analytics calculations ----
  const totalCourses = courses.length;
  const totalEnrolledStudents = courses.reduce((sum, course) => sum + (course.enrolledCount || 0), 0);

  // Category distribution for Pie Chart
  const categoryData = [];
  const categoryMap = {};
  courses.forEach(course => {
    if (categoryMap[course.category]) {
      categoryMap[course.category] += 1;
    } else {
      categoryMap[course.category] = 1;
    }
  });
  for (const cat in categoryMap) {
    categoryData.push({ name: cat, value: categoryMap[cat] });
  }

  // Course-wise enrollment for Bar Chart
  const enrollmentData = courses.map(course => ({
    title: course.title.length > 15 ? course.title.slice(0, 15) + '…' : course.title,
    enrolled: course.enrolledCount || 0,
  }));

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">Instructor Analytics Dashboard 📊</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border rounded shadow p-4 text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-1">Total Courses</h3>
          <p className="text-3xl font-bold text-indigo-600">{totalCourses}</p>
        </div>
        <div className="bg-white border rounded shadow p-4 text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-1">Total Enrolled Students</h3>
          <p className="text-3xl font-bold text-green-600">{totalEnrolledStudents}</p>
        </div>
        <div className="bg-white border rounded shadow p-4 text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-1">Categories</h3>
          <p className="text-3xl font-bold text-orange-600">{categoryData.length}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Course-wise Enrollment Bar Chart */}
        <div className="bg-white border rounded shadow p-4">
          <h4 className="text-lg font-semibold mb-3 text-gray-700">Enrollments per Course</h4>
          {enrollmentData.length === 0 ? (
            <p className="text-gray-500 italic text-sm text-center">No course data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={enrollmentData} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
                <XAxis dataKey="title" angle={-25} textAnchor="end" interval={0} height={60} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="enrolled" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="bg-white border rounded shadow p-4">
          <h4 className="text-lg font-semibold mb-3 text-gray-700">Course Categories Distribution</h4>
          {categoryData.length === 0 ? (
            <p className="text-gray-500 italic text-sm text-center">No category data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
