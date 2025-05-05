import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [googleCredential, setGoogleCredential] = useState(null); // State to store Google credential
  const [showRoleSelection, setShowRoleSelection] = useState(false); // State to control role selection visibility
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', data);
      login(res.data);
      toast.success('Login successful!');

      const role = res.data.user.role;
      if (role === 'INSTRUCTOR') navigate('/instructor/dashboard');
      else if (role === 'STUDENT') navigate('/student/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    setGoogleCredential(credentialResponse?.credential);
    setShowRoleSelection(true); // Show role selection after successful Google sign-in
  };

  const handleGoogleError = () => {
    console.error('Google Sign-In Failed');
    toast.error('Google Sign-In Failed');
  };

  const handleRoleSubmit = async (role) => {
    if (googleCredential) {
      try {
        const res = await axios.post('http://localhost:5000/api/auth/google-login', {
          token: googleCredential,
          role: role, // Send the selected role to the backend
        });
        // console.log(res.data);
        login(res.data);
        toast.success('Google login successful!');

        const userRole = res.data.user.role;
        if (userRole === 'INSTRUCTOR') navigate('/instructor/dashboard');
        else if (userRole === 'STUDENT') navigate('/student/dashboard');
      } catch (error) {
        console.error('Google login with role selection failed:', error);
        toast.error(error.response?.data?.message || 'Google login failed');
      } finally {
        setShowRoleSelection(false); // Hide role selection after submission
        setGoogleCredential(null); // Clear Google credential
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
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

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 cursor-pointer">
          Login
        </button>
      </form>

      <div className="mt-4">
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <GoogleLogin
            render={({ onClick }) => (
              <button
                onClick={onClick}
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 cursor-pointer text-center"
              >
                Sign in with Google
              </button>
            )}
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          // cookiePolicy="single_host_origin"
          />
        </GoogleOAuthProvider>
      </div>

      {showRoleSelection && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2">Select your role:</h3>
          <button
            onClick={() => handleRoleSubmit('STUDENT')}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 cursor-pointer mb-2"
          >
            Student
          </button>
          <button
            onClick={() => handleRoleSubmit('INSTRUCTOR')}
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 cursor-pointer"
          >
            Instructor
          </button>
        </div>
      )}

      <p className="text-sm mt-4 text-center">
        Don’t have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
