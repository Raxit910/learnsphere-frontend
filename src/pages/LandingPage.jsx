import React from 'react';

export default function LandingPage() {
  return (
    <div className="font-sans bg-gray-100 text-gray-900">
      <header className="bg-green-500 text-white py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Welcome to LearnSphere</h1>
          <p className="text-lg mb-8">Unlock Your Potential Through Collaborative Learning.</p>
          <p className="text-md leading-relaxed">
            LearnSphere is a platform designed to foster a vibrant learning community. Connect with fellow learners, share knowledge, and embark on a journey of continuous growth.
          </p>
        </div>
      </header>

      <section className="py-16 text-center">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-12">Explore the Possibilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-green-500 mb-2">Connect and Collaborate</h3>
              <p className="text-gray-700 leading-relaxed">
                Join study groups, participate in discussions, and learn from a diverse community of individuals.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-green-500 mb-2">Discover New Skills</h3>
              <p className="text-gray-700 leading-relaxed">
                Explore a wide range of topics and access resources to expand your knowledge and abilities.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-green-500 mb-2">Share Your Expertise</h3>
              <p className="text-gray-700 leading-relaxed">
                Contribute your insights, help others learn, and build your reputation within the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-200 py-16 text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-8">Ready to Get Started?</h2>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md">
              Login
            </button>
            <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-md">
              Register
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-6 text-center">
        <p>&copy; 2025 LearnSphere. All rights reserved.</p>
      </footer>
    </div>
  );
};
