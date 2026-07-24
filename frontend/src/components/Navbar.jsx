import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-bold text-xl flex items-center gap-2">
            💰 Loan Management
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          <div className={`${isOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-center gap-6 absolute md:static top-16 left-0 right-0 bg-blue-600 md:bg-transparent p-4 md:p-0`}>
            {token ? (
              <>
                <Link to="/dashboard" className="hover:text-blue-200 transition">
                  Dashboard
                </Link>
                <Link to="/my-loans" className="hover:text-blue-200 transition">
                  My Loans
                </Link>
                <Link to="/apply-loan" className="hover:text-blue-200 transition">
                  Apply Loan
                </Link>
                <div className="flex items-center gap-4">
                  <span className="text-sm">{user?.firstName} {user?.lastName}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg transition"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition">
                  Login
                </Link>
                <Link to="/register" className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg transition">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
