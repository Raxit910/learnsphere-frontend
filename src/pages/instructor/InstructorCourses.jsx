import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import CourseForm from '../../components/CourseForm';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Eye, Pencil, Trash2, PlusCircle } from 'lucide-react';

export default function InstructorCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);

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
          <div className="flex justify-end">
            <button
              className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 mb-4 rounded hover:bg-green-700 cursor-pointer"
              onClick={() => navigate('/instructor/add-Course')}
            >
              <PlusCircle size={18} /> Add New Course
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white p-4 border rounded shadow text-sm flex flex-col justify-between">
                <h3 className="text-lg font-semibold">{course.title}</h3>
                <span className="bg-green-200 text-xs text-black rounded-full px-2 inline-flex items-center w-fit">
                  {course.category}
                </span>
                <p className="text-sm mt-1">{course.description}</p>

                <div className="flex flex-wrap gap-2 mt-3 text-xs md:text-sm">
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
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
