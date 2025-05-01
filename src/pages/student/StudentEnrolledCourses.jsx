import { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function StudentEnrolledCourses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem('learnsphere-user'))?.token;

  const fetchEnrolledCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/students/my-courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
    } catch (err) {
      toast.error('Failed to load enrolled courses');
    }
  };

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">My Enrolled Courses</h2>

      {courses.length === 0 ? (
        <p>No courses enrolled yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white border rounded shadow p-4 text-sm flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold truncate">{course.title}</h3>
                <p className="text-xs text-gray-500 mb-2">{course.category}</p>
                <p className="line-clamp-3 text-xs text-gray-700">{course.description}</p>
              </div>

              <button
                className="mt-4 bg-indigo-600 text-white py-1 rounded hover:bg-indigo-700 text-sm"
                onClick={() => navigate(`/student/course/${course.id}`)}
              >
                View Sessions
              </button>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
