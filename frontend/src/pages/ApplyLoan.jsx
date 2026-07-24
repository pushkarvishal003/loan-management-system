import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiDollarSign, FiCalendar, FiPercent, FiTrendingUp } from 'react-icons/fi';

const ApplyLoan = () => {
  const { token, user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    loanAmount: '',
    loanTenureMonths: '',
    interestRate: 8.5,
    loanPurpose: 'General',
  });
  const [monthlyEMI, setMonthlyEMI] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Calculate EMI when inputs change
  useEffect(() => {
    if (formData.loanAmount && formData.loanTenureMonths) {
      const P = parseFloat(formData.loanAmount);
      const R = parseFloat(formData.interestRate) / 100 / 12;
      const N = parseInt(formData.loanTenureMonths);

      if (R === 0) {
        const emi = P / N;
        setMonthlyEMI(emi.toFixed(2));
        setTotalInterest(0);
        setTotalAmount(P.toFixed(2));
      } else {
        const numerator = P * R * Math.pow(1 + R, N);
        const denominator = Math.pow(1 + R, N) - 1;
        const emi = numerator / denominator;
        const totalInt = emi * N - P;
        setMonthlyEMI(emi.toFixed(2));
        setTotalInterest(totalInt.toFixed(2));
        setTotalAmount((P + totalInt).toFixed(2));
      }
    }
  }, [formData.loanAmount, formData.loanTenureMonths, formData.interestRate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('/api/loans/apply', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Loan application submitted successfully!');
      setFormData({
        loanAmount: '',
        loanTenureMonths: '',
        interestRate: 8.5,
        loanPurpose: 'General',
      });
      setTimeout(() => window.location.href = '/my-loans', 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to apply for loan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Apply for Loan</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiDollarSign className="inline mr-2" />Loan Amount (₹)
            </label>
            <input
              type="number"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleChange}
              required
              min="10000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter loan amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiCalendar className="inline mr-2" />Tenure (Months)
            </label>
            <input
              type="number"
              name="loanTenureMonths"
              value={formData.loanTenureMonths}
              onChange={handleChange}
              required
              min="12"
              max="360"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter tenure in months"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiPercent className="inline mr-2" />Interest Rate (% p.a.)
            </label>
            <input
              type="number"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Interest rate"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Purpose
            </label>
            <select
              name="loanPurpose"
              value={formData.loanPurpose}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>General</option>
              <option>Home Purchase</option>
              <option>Education</option>
              <option>Business</option>
              <option>Vehicle</option>
              <option>Medical</option>
              <option>Other</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Apply for Loan'}
          </button>
        </form>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-6 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loan Summary</h2>

          <div className="bg-white rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Loan Amount</span>
              <span className="font-bold text-lg">₹{parseFloat(formData.loanAmount || 0).toLocaleString()}</span>
            </div>
            <hr />
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tenure</span>
              <span className="font-bold text-lg">{formData.loanTenureMonths} months</span>
            </div>
            <hr />
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Interest Rate</span>
              <span className="font-bold text-lg">{formData.interestRate}% p.a.</span>
            </div>
            <hr />
            <div className="flex justify-between items-center bg-blue-50 p-3 rounded">
              <span className="text-gray-800 font-semibold">Monthly EMI</span>
              <span className="font-bold text-xl text-blue-600">₹{monthlyEMI}</span>
            </div>
            <hr />
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Interest</span>
              <span className="font-bold text-lg">₹{parseFloat(totalInterest).toLocaleString()}</span>
            </div>
            <hr />
            <div className="flex justify-between items-center bg-green-50 p-3 rounded">
              <span className="text-gray-800 font-semibold">Total Amount to Pay</span>
              <span className="font-bold text-xl text-green-600">₹{parseFloat(totalAmount).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyLoan;
