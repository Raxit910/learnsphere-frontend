import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import InstructorDashboard from '../pages/instructor/Dashboard';
import StudentDashboard from '../pages/student/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import InstructorCourses from '../pages/instructor/InstructorCourses';
import AddSession from '../pages/instructor/AddSession';
import CourseSessions from '../pages/instructor/CourseSessions';
import StudentCourses from '../pages/student/StudentCourses';
import StudentEnrolledCourses from '../pages/student/StudentEnrolledCourses';
import SessionViewer from '../pages/student/SessionViewer';
import LandingPage from '../pages/LandingPage';
import AddCourse from '../pages/instructor/AddCourse';
import NotFoundPage from '../pages/NotFoundPage';
import PublicRoute from './PublicRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />

      <Route path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      
      {/* Instructor Protected Routes */}
      <Route
        path="/instructor/dashboard"
        element={
          <ProtectedRoute role="INSTRUCTOR">
            <InstructorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/instructor/courses"
        element={
          <ProtectedRoute role="INSTRUCTOR">
            <InstructorCourses />
          </ProtectedRoute>
        }
      />

      <Route
        path="/instructor/add-course"
        element={
          <ProtectedRoute role="INSTRUCTOR">
            <AddCourse />
          </ProtectedRoute>
        }
      />

      <Route
        path="/instructor/sessions"
        element={
          <ProtectedRoute role="INSTRUCTOR">
            <AddSession />
          </ProtectedRoute>
        }
      />

      <Route
        path="/instructor/course/:id/sessions"
        element={
          <ProtectedRoute role="INSTRUCTOR">
            <CourseSessions />
          </ProtectedRoute>
        }
      />



      {/* Student Protected Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute role="STUDENT">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/courses"
        element={
          <ProtectedRoute role="STUDENT">
            <StudentCourses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/my-courses"
        element={
          <ProtectedRoute role="STUDENT">
            <StudentEnrolledCourses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/course/:id"
        element={
          <ProtectedRoute role="STUDENT">
            <SessionViewer />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}