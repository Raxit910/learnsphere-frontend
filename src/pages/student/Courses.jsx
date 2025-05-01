import { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../layouts/DashboardLayout';
import { toast } from 'react-toastify';

export default function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const token = JSON.parse(localStorage.getItem('learnsphere-user'))?.token;

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/students/courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(res.data);

      setCourses(res.data);
    } catch (err) {
      toast.error('Failed to fetch courses');
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/students/my-courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(res.data);

      // Extract only the IDs
      const enrolledIds = res.data.map(course => course.id);
      setEnrolledCourseIds(enrolledIds);
    } catch (err) {
      toast.error('Failed to fetch enrollments');
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchEnrolledCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await axios.post(`http://localhost:5000/api/students/enroll/${courseId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Enrolled successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    }
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">Browse Courses</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {courses.map((course) => {
          const isEnrolled = enrolledCourseIds.includes(course.id); // ✅ Check enrollment here

          return (
            <div
              key={course.id}
              className="bg-white p-4 border rounded shadow text-sm flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-lg truncate">{course.title}</h3>
                <span className="bg-green-200 text-xs text-gray-600 rounded-full px-2 inline-flex items-center w-fit">
                  {course.category}
                </span>
                <p className="line-clamp-3 text-xs text-gray-700">{course.description}</p>
              </div>

              <button
                className={`mt-4 py-1 text-sm rounded w-full ${isEnrolled
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                  }`}
                onClick={() => !isEnrolled && handleEnroll(course.id)}
                disabled={isEnrolled}
              >
                {isEnrolled ? 'Enrolled' : 'Enroll'}
              </button>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
