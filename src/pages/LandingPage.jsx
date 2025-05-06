import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="font-sans bg-white text-gray-900 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 sm:py-6 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Learn Sphere</h1>
          <div className="space-x-3 flex items-center">
            <button
              onClick={() => navigate('/login')}
              className="bg-white text-green-600 hover:bg-gray-100 font-semibold py-2 px-4 rounded-lg shadow-sm transition-all duration-200 text-sm md:text-base cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-all duration-200 text-sm md:text-base cursor-pointer"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-4 py-12 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
          Empower Your Learning Journey
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mb-10">
          Join a vibrant community of learners. Explore new skills, collaborate with peers, and share your knowledge — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => navigate('/register')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200 text-base cursor-pointer"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate('/login')}
            className="bg-white text-green-600 border border-green-600 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg shadow-sm transition duration-200 text-base cursor-pointer"
          >
            I already have an account
          </button>
        </div>
      </section>


      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-12">Why LearnSphere?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition duration-200">
              <div className="flex items-center justify-center mb-4">
                <span className="bg-green-100 text-green-600 p-3 rounded-full text-3xl">🤝</span>
              </div>
              <h4 className="text-xl font-semibold text-green-600 mb-2 text-center">Connect & Collaborate</h4>
              <p className="text-gray-600 text-center">
                Join study groups, participate in discussions, and grow together with a diverse global community.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition duration-200">
              <div className="flex items-center justify-center mb-4">
                <span className="bg-green-100 text-green-600 p-3 rounded-full text-3xl">🧠</span>
              </div>
              <h4 className="text-xl font-semibold text-green-600 mb-2 text-center">Discover New Skills</h4>
              <p className="text-gray-600 text-center">
                Access curated courses and hands-on resources to expand your knowledge in any subject area.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition duration-200">
              <div className="flex items-center justify-center mb-4">
                <span className="bg-green-100 text-green-600 p-3 rounded-full text-3xl">🌟</span>
              </div>
              <h4 className="text-xl font-semibold text-green-600 mb-2 text-center">Share Your Expertise</h4>
              <p className="text-gray-600 text-center">
                Contribute your insights, mentor others, and build your professional reputation as a thought leader.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6 text-center text-sm">
        <p>&copy; 2025 LearnSphere. All rights reserved.</p>
      </footer>
    </div>
  );
}
