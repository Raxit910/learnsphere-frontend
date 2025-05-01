import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import CourseForm from '../../components/CourseForm';
import DashboardLayout from '../../layouts/DashboardLayout';

export default function Courses() {
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
      if (editingCourse) {
        await axios.put(`http://localhost:5000/api/courses/${editingCourse.id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Course updated');
        setEditingCourse(null);
      } else {
        await axios.post(`http://localhost:5000/api/courses`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Course created');
      }

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
      <h2 className="text-2xl font-bold mb-4">Manage Courses</h2>

      <CourseForm
        key={editingCourse?.id || 'new'}
        initialData={editingCourse}
        onSubmit={handleSubmit}
        onCancel={() => setEditingCourse(null)}
      />

      <div className="space-y-4">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-4 shadow border rounded">
            <h3 className="text-lg font-semibold">{course.title}</h3>
            <p className="text-sm text-gray-600">{course.category}</p>
            <p className="text-sm mt-1">{course.description}</p>

            <div className="flex gap-4 mt-3">
              <Link
                to={`/instructor/course/${course.id}/sessions`}
                className="text-indigo-600 hover:underline"
              >
                View Sessions
              </Link>
              <button
                onClick={() => setEditingCourse(course)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(course.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
