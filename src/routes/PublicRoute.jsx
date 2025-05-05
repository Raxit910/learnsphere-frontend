import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PublicRoute ({ children }) {
  const { user } = useContext(AuthContext);

  if(user?.user?.role === 'STUDENT') {
    return <Navigate to="/student/dashboard" replace />;
  }

  if(user?.user?.role === 'INSTRUCTOR') {
    return <Navigate to="/instructor/dashboard" replace />;
  }

  return children;
}