import { NavLink } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const linkClasses = ({ isActive }) =>
    isActive
      ? 'font-semibold text-blue-700 underline'
      : 'hover:underline';

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
        } md:translate-x-0 transform transition-transform duration-300 fixed md:static z-50 bg-gray-300 p-4 w-60 min-h-screen`}
      >
        <ul className="space-y-3 list-disc list-inside">
          {user?.user?.role === 'INSTRUCTOR' && (
            <>
              <li><NavLink to="/instructor/dashboard" className={linkClasses}>Dashboard</NavLink></li>
              <li><NavLink to="/instructor/courses" className={linkClasses}>View & Manage Your Courses</NavLink></li>
              <li><NavLink to="/instructor/add-course" className={linkClasses}>Add New Courses</NavLink></li>
              <li><NavLink to="/instructor/sessions" className={linkClasses}>Add Sessions to Your Courses</NavLink></li>
            </>
          )}
          {user?.user?.role === 'STUDENT' && (
            <>
              <li><NavLink to="/student/dashboard" className={linkClasses}>Dashboard</NavLink></li>
              <li><NavLink to="/student/courses" className={linkClasses}>View All Courses</NavLink></li>
              <li><NavLink to="/student/my-courses" className={linkClasses}>My Enrolled Courses</NavLink></li>
            </>
          )}
        </ul>
      </aside>
    </>
  );
}
