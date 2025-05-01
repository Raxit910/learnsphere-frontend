import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import SessionCard from '../../components/SessionCard';
import axios from 'axios';

export default function CourseSessions() {
  const { id } = useParams(); // courseId
  const [course, setCourse] = useState(null);
  const [sessions, setSessions] = useState([]);

  const token = JSON.parse(localStorage.getItem('learnsphere-user'))?.token;

  const fetchData = async () => {
    try {
      const courseRes = await axios.get(`http://localhost:5000/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sessionRes = await axios.get(`http://localhost:5000/api/sessions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCourse(courseRes.data);
      setSessions(sessionRes.data);
    } catch {
      console.log('Failed to load sessions');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">
        Sessions for: {course?.title || 'Loading...'}
      </h2>

      {sessions.length === 0 ? (
        <p>No sessions added yet.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              isInstructor={true}
            />
          ))}
        </ul>
      )}
    </DashboardLayout>
  );
}
