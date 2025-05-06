import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center relative z-50">
      <h1 className="text-2xl font-bold">Learn Sphere</h1>

      {/* Desktop Logout */}
      <div className="hidden md:block">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded-2xl cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 right-4 bg-gray-700 p-4 rounded shadow-md md:hidden">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
