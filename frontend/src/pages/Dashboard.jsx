import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiArrowRight, FiDollarSign, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome, {user?.firstName}! 👋</h1>
          <p className="text-blue-100">Manage your loans and payments efficiently</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <button
            onClick={() => navigate('/apply-loan')}
            className="bg-white hover:shadow-lg transition rounded-lg shadow p-6 text-center group"
          >
            <div className="text-4xl mb-3 flex justify-center">
              <FiDollarSign className="text-blue-600 group-hover:scale-110 transition" />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">Apply for Loan</h3>
            <p className="text-sm text-gray-600 mb-3">Get quick funding</p>
            <div className="flex items-center justify-center text-blue-600 text-sm font-semibold">
              Apply Now <FiArrowRight className="ml-2" />
            </div>
          </button>

          <button
            onClick={() => navigate('/my-loans')}
            className="bg-white hover:shadow-lg transition rounded-lg shadow p-6 text-center group"
          >
            <div className="text-4xl mb-3 flex justify-center">
              <FiCheckCircle className="text-green-600 group-hover:scale-110 transition" />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">My Loans</h3>
            <p className="text-sm text-gray-600 mb-3">View all loans</p>
            <div className="flex items-center justify-center text-green-600 text-sm font-semibold">
              View <FiArrowRight className="ml-2" />
            </div>
          </button>

          <div className="bg-white hover:shadow-lg transition rounded-lg shadow p-6 text-center">
            <div className="text-4xl mb-3 flex justify-center text-purple-600">💳</div>
            <h3 className="font-bold text-gray-800 mb-1">Credit Score</h3>
            <p className="text-2xl font-bold text-gray-600 mt-2">{user?.creditScore || 600}</p>
          </div>

          <div className="bg-white hover:shadow-lg transition rounded-lg shadow p-6 text-center">
            <div className="text-4xl mb-3 flex justify-center">
              <FiTrendingUp className="text-orange-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">Status</h3>
            <p className="text-lg font-bold text-green-600 mt-2">Active</p>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Why Choose Us?</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="text-2xl">✅</div>
                <div>
                  <h3 className="font-bold text-gray-800">Quick Approval</h3>
                  <p className="text-gray-600 text-sm">Get loan approval in minutes</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl">💰</div>
                <div>
                  <h3 className="font-bold text-gray-800">Competitive Rates</h3>
                  <p className="text-gray-600 text-sm">Best interest rates in market</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl">📱</div>
                <div>
                  <h3 className="font-bold text-gray-800">Easy Payment</h3>
                  <p className="text-gray-600 text-sm">Multiple payment options available</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl">🔒</div>
                <div>
                  <h3 className="font-bold text-gray-800">Secure & Safe</h3>
                  <p className="text-gray-600 text-sm">Your data is completely secure</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">How It Works</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="font-bold text-gray-800">Apply</h3>
                  <p className="text-gray-600 text-sm">Fill out the loan application form</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="font-bold text-gray-800">Verify</h3>
                  <p className="text-gray-600 text-sm">Get KYC verification done</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="font-bold text-gray-800">Approve</h3>
                  <p className="text-gray-600 text-sm">Get instant approval</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <h3 className="font-bold text-gray-800">Receive</h3>
                  <p className="text-gray-600 text-sm">Funds disbursed to your account</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
