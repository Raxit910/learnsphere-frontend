import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import SessionCard from '../../components/SessionCard';
import SessionForm from '../../components/instructor/SessionForm';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PlusCircle } from 'lucide-react';

export default function CourseSessions() {
  const { id } = useParams(); // courseId
  const [course, setCourse] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [editingSession, setEditingSession] = useState(null);
  const navigate = useNavigate();

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
      toast.error('Failed to load course/sessions');
    }
  };

  const handleFormSubmit = async (data, reset, editor) => {
    try {
      if (editingSession) {
        await axios.put(`http://localhost:5000/api/sessions/${editingSession.id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Session updated');
        setEditingSession(null);
      } else {
        await axios.post('http://localhost:5000/api/sessions', data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Session created');
      }

      reset();
      editor.commands.clearContent();
      fetchData();
    } catch {
      toast.error('Action failed');
    }
  };

  const handleEdit = (sessionId) => {
    const session = sessions.find((s) => s.id === sessionId);
    setEditingSession(session);
  };

  const handleDelete = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Session deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete session');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-4">
        Sessions for: {course?.title || 'Loading...'}
      </h2>

      {editingSession && (
        <SessionForm
          onSubmit={handleFormSubmit}
          courseOptions={course ? [course] : []}
          editingSession={editingSession}
          setEditingSession={setEditingSession}
        />
      )}

      {sessions.length === 0 ? (
        <div>
          <p>No sessions added yet.</p>
          <button
            className="flex items-center bg-green-600 gap-1 text-white px-2 py-1 mt-4 rounded hover:bg-green-700 cursor-pointer"
            onClick={() => navigate('/instructor/sessions')}
          >
            <PlusCircle size={15} /> Add New Session
          </button>
        </div>
      ) : (
        <div>
          <div className="flex justify-end mb-4">
            <button
              className="flex items-center bg-green-600 gap-1 text-white px-2 py-1 rounded hover:bg-green-700 cursor-pointer"
              onClick={() => navigate('/instructor/sessions')}
            >
              <PlusCircle size={15}/> Add New Session
            </button>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                isInstructor={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        </div>
      )}
    </DashboardLayout>
  );
}
