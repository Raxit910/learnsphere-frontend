import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useContext(AuthContext);

  return (
    <aside className="bg-gray-100 p-4 min-h-screen w-60">
      <ul className="space-y-4">
        {user?.user?.role === 'INSTRUCTOR' && (
          <>
            <li>
              <Link to="/instructor/dashboard" className="hover:underline">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/instructor/courses" className="hover:underline">
                View & Manage Your Courses
              </Link>
            </li>
            <li>
              <Link to="/instructor/add-course" className="hover:underline">
                Add New Courses 
              </Link>
            </li>
            <li>
              <Link to="/instructor/sessions" className="hover:underline">
                Add Sessions to Your Courses 
              </Link>
            </li>
          </>
        )}

        {user?.user?.role === 'STUDENT' && (
          <>
            <li>
              <Link to="/student/dashboard" className="hover:underline">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/student/courses" className="hover:underline">
                View All Courses
              </Link>
            </li>
            <li>
              <Link to="/student/my-courses" className="hover:underline">
                My Enrolled Courses
              </Link>
            </li>
          </>
        )}
      </ul>
    </aside>
  );
}