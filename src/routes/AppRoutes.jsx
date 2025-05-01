import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import InstructorDashboard from '../pages/instructor/Dashboard';
import StudentDashboard from '../pages/student/Dashboard';
import ProtectedRoute from '../components/ProtectedRoute';
import Courses from '../pages/instructor/Courses';
import AddSession from '../pages/instructor/AddSession';
import CourseSessions from '../pages/instructor/CourseSessions';
import StudentCourses from '../pages/student/Courses';
import StudentEnrolledCourses from '../pages/student/StudentEnrolledCourses';
import CourseViewer from '../pages/student/CourseViewer';
import LandingPage from '../pages/LandingPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path='/LandingPage' element={<LandingPage />} />
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

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
            <Courses />
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
            <CourseViewer />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}