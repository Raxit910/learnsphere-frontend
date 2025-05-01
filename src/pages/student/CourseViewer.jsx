import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import SessionCard from '../../components/SessionCard';
import axios from 'axios';
// import ReactPlayer from 'react-player';
import { toast } from 'react-toastify';

export default function CourseViewer() {
  const { id } = useParams(); // courseId
  const [course, setCourse] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [completed, setCompleted] = useState([]);

  const token = JSON.parse(localStorage.getItem('learnsphere-user'))?.token;

  const fetchData = async () => {
    try {
      const courseRes = await axios.get(`http://localhost:5000/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sessionRes = await axios.get(`http://localhost:5000/api/sessions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const completedRes = await axios.get(`http://localhost:5000/api/progress/completed/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(courseRes.data);

      setCourse(courseRes.data);
      setSessions(sessionRes.data);
      setCompleted(completedRes.data);
    } catch (err) {
      toast.error('Failed to load sessions');
    }
  };

  const markAsComplete = async (sessionId) => {
    try {
      await axios.post(`http://localhost:5000/api/progress/${sessionId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Session marked as complete');
      setCompleted((prev) => [...prev, sessionId]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Already marked complete');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const total = sessions.length;
  const done = completed.length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">
        {course ? `Sessions for: ${course.title}` : 'Loading...'}
      </h2>

      {/* Progress Bar */}
      {total > 0 && (
        <div className="mb-6">
          <div className="w-full bg-gray-200 h-3 rounded">
            <div
              className="bg-green-600 h-3 rounded"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-sm mt-1 text-gray-600">
            Progress: {done} / {total} sessions complete ({percent}%)
          </p>
        </div>
      )}

      {sessions.length === 0 ? (
        <p>No sessions available for this course yet.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sessions.map((session) => {
            const isDone = completed.includes(session.id);

            return (
              <SessionCard
                key={session.id}
                session={session}
                isDone={isDone}
                onComplete={() => markAsComplete(session.id)}
                isInstructor={false}
              />
            );
          })}
        </ul>
      )}
    </DashboardLayout>
  );
}
