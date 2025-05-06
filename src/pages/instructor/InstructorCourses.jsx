import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import CourseForm from '../../components/instructor/CourseForm';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Eye, Pencil, Trash2, PlusCircle, Search, Star } from 'lucide-react';
import ReviewModal from '../../components/instructor/ReviewModel';

export default function InstructorCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedCourseForReviews, setSelectedCourseForReviews] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const token = JSON.parse(localStorage.getItem('learnsphere-user'))?.token;

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/courses/my-courses', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCourses(res.data);
    } catch (err) {
      toast.error('Failed to load courses');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (data, reset) => {
    try {
      await axios.put(`http://localhost:5000/api/courses/${editingCourse.id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Course updated');
      setEditingCourse(null);
      fetchCourses();
      reset();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Course deleted');
      fetchCourses();
    } catch {
      toast.error('Failed to delete course');
    }
  };

  const handleViewReviews = (course) => {
    setSelectedCourseForReviews(course);
    setShowReviewModal(true);
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
      <h2 className="text-2xl font-bold mb-4">Manage Your Courses</h2>

      {editingCourse ? (
        <CourseForm
          key={editingCourse.id}
          initialData={editingCourse}
          onSubmit={handleSubmit}
          onCancel={() => setEditingCourse(null)}
        />
      ) : null}

      {courses.length === 0 ? (
        <div>
          <p>No courses added yet.</p>
          <button
            className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 mt-4 rounded hover:bg-green-700 cursor-pointer"
            onClick={() => navigate('/instructor/add-Course')}
          >
            <PlusCircle size={18} /> Add New Course
          </button>
        </div>
      ) : (
        <div>
         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">

            {/* Search and Filter bar */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
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
                className="py-2 px-2 border rounded w-full sm:w-48 text-sm focus:outline-none focus:ring focus:border-indigo-300"
              >
                <option value="">All Categories</option>
                {uniqueCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="flex items-center gap-2 bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 cursor-pointer w-full sm:w-auto"
              onClick={() => navigate('/instructor/add-Course')}
            >
              <PlusCircle size={16} /> Add New Course
            </button>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div key={course.id} className="bg-white p-4 border rounded shadow text-sm flex flex-col justify-between">
                  <h3 className="text-lg font-semibold">{course.title}</h3>
                  <span className="bg-green-200 text-xs text-black rounded-full px-2 inline-flex items-center w-fit mt-1">
                    {course.category}
                  </span>
                  <p className="text-sm mt-1">{course.description}</p>

                  <div className="flex flex-wrap gap-3 mt-3 text-xs md:text-sm">
                    <Link
                      to={`/instructor/course/${course.id}/sessions`}
                      className="flex items-center gap-1 text-indigo-600 hover:underline"
                    >
                      <Eye size={16} />Sessions
                    </Link>
                    <button
                      onClick={() => setEditingCourse(course)}
                      className="flex items-center gap-1 text-blue-600 hover:underline cursor-pointer"
                    >
                      <Pencil size={16} />Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="flex items-center gap-1 text-red-600 hover:underline cursor-pointer"
                    >
                      <Trash2 size={16} />Delete
                    </button>
                    <button
                      onClick={() => handleViewReviews(course)}
                      className="flex items-center gap-1 text-yellow-600 hover:underline cursor-pointer"
                    >
                      <Star size={16} />Reviews
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-gray-600 italic text-center">No courses match your search/filter.</p>
            )}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedCourseForReviews && (
        <ReviewModal 
          courseId={selectedCourseForReviews.id}
          courseName={selectedCourseForReviews.title}
          token={token}
          onClose={() => setShowReviewModal(false)}
        />
      )}
    </DashboardLayout>
  );
}