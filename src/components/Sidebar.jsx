import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden p-4 z-50 relative">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transform transition-transform duration-300 fixed md:static z-50 bg-gray-100 p-4 w-60 min-h-screen`}
      >
        <ul className="space-y-4">
          {user?.user?.role === 'INSTRUCTOR' && (
            <>
              <li><Link to="/instructor/dashboard" className="hover:underline">Dashboard</Link></li>
              <li><Link to="/instructor/courses" className="hover:underline">View & Manage Your Courses</Link></li>
              <li><Link to="/instructor/add-course" className="hover:underline">Add New Courses</Link></li>
              <li><Link to="/instructor/sessions" className="hover:underline">Add Sessions to Your Courses</Link></li>
            </>
          )}
          {user?.user?.role === 'STUDENT' && (
            <>
              <li><Link to="/student/dashboard" className="hover:underline">Dashboard</Link></li>
              <li><Link to="/student/courses" className="hover:underline">View All Courses</Link></li>
              <li><Link to="/student/my-courses" className="hover:underline">My Enrolled Courses</Link></li>
            </>
          )}
        </ul>
      </aside>
    </>
  );
}
