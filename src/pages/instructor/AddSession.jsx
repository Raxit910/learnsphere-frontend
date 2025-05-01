import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import SessionForm from '../../components/SessionForm';
import DashboardLayout from '../../layouts/DashboardLayout';

export default function AddSession() {
  const [courses, setCourses] = useState([]);

  const token = JSON.parse(localStorage.getItem('learnsphere-user'))?.token;

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/courses/my-courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
    } catch {
      toast.error('Failed to fetch courses');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateSession = async (data, reset, editor) => {
    try {
      await axios.post(`http://localhost:5000/api/sessions/${data.courseId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Session created');
      reset();
      editor?.commands.setContent('');
    } catch (err) {
      toast.error('Failed to create session');
    }
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-4">Add New Session</h2>
      <SessionForm onSubmit={handleCreateSession} courseOptions={courses} />
    </DashboardLayout>
  );
}
