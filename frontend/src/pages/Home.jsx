import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 text-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">Loan Management System</h1>
        <p className="text-xl md:text-2xl mb-8 text-blue-100">Simple, Secure, and Smart Loan Solutions</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => navigate('/login')}
            className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-8 rounded-lg transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="border-2 border-white hover:bg-white hover:text-blue-600 font-bold py-3 px-8 rounded-lg transition"
          >
            Register
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white text-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '📋', title: 'Easy Application', desc: 'Apply for loans with just a few clicks' },
              { icon: '⚡', title: 'Fast Processing', desc: 'Quick approval and disbursement' },
              { icon: '💳', title: 'EMI Calculator', desc: 'Calculate your EMI before applying' },
              { icon: '📊', title: 'Track Payments', desc: 'Monitor your payment history' },
              { icon: '🔒', title: 'Secure', desc: 'Your data is completely secure' },
              { icon: '👥', title: '24/7 Support', desc: 'Round the clock customer support' },
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
