import React from "react";
import axios from 'axios';
import CourseForm from "../../components/CourseForm";
import DashboardLayout from "../../layouts/DashboardLayout";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AddCourse() {

  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem('learnsphere-user'))?.token;

  const handleAddCourse = async (data, reset) => {
    try {
      await axios.post(`http://localhost:5000/api/courses`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.success('Course created successfully');
      reset();
      navigate('/instructor/courses')
    } catch (err) {
      toast.error('Failed to create course');
    }
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-4">Add New Course</h2>
      <CourseForm
        onSubmit={handleAddCourse}
      />
    </DashboardLayout>
  )
}