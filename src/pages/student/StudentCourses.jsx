import { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../layouts/DashboardLayout';
import { toast } from 'react-toastify';
import { Search } from 'lucide-react';

export default function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const token = JSON.parse(localStorage.getItem('learnsphere-user'))?.token;

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/students/courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      setEnrolledCourseIds((prev) => [...prev, courseId]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    }
  };

  // Get unique categories for filter dropdown
  const uniqueCategories = [...new Set(courses.map((course) => course.category))].sort();

  // Filter and search logic
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (categoryFilter === '' || course.category === categoryFilter)
  );

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">Browse Courses</h2>

      {/* Search and Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-6">
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-2 top-2.5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-2 border rounded w-full focus:outline-none focus:ring focus:border-indigo-300 text-sm"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="py-2 px-3 border rounded w-full sm:w-48 text-sm focus:outline-none focus:ring focus:border-indigo-300"
        >
          <option value="">All Categories</option>
          {uniqueCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredCourses.map((course) => {
          const isEnrolled = enrolledCourseIds.includes(course.id);
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
