import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['INSTRUCTOR', 'STUDENT']),
});

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', data);
      toast.success('Registered successfully! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="email"
            {...register('email')}
            placeholder="Email"
            className="w-full border p-2 rounded"
          />
        </div>
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}

        <div className='relative'>
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            placeholder="Password"
            className="w-full border p-2 rounded"
          />
          <span onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-2 cursor-pointer">
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}

        <select {...register('role')} className="w-full border p-2 rounded">
          <option value="">Select Role</option>
          <option value="INSTRUCTOR">Instructor</option>
          <option value="STUDENT">Student</option>
        </select>
        {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}

        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 cursor-pointer">
          Register
        </button>
      </form>

      <p className="text-sm mt-4 text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
