import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const getUserData = JSON.parse(localStorage.getItem('learnsphere-user'));
  const getRole = getUserData.user.role;
  
  const handleNavigate = () => {
    if (getRole === 'INSTRUCTOR'){
      navigate('/instructor/dashboard')
    }
    else if (getRole === 'STUDENT') {
      navigate('/student/dashboard')
    }
    else {
      logout();
      navigate('/');
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-bold text-indigo-600">404</h1>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
            Page Not Found
          </h2>
          <p className="mt-2 text-lg text-gray-500">
            Oops! The page you are looking for does not exist.
          </p>
        </div>
        <div>
          <button onClick={handleNavigate} className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer">
            Go back to homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;