import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiDollarSign, FiCreditCard } from 'react-icons/fi';

const MakePayment = () => {
  const { loanId } = useParams();
  const { token } = useContext(AuthContext);
  const [loan, setLoan] = useState(null);
  const [upcomingEMIs, setUpcomingEMIs] = useState([]);
  const [selectedEMI, setSelectedEMI] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    transactionId: '',
    paymentMethod: 'online',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchLoanData();
  }, [loanId]);

  const fetchLoanData = async () => {
    try {
      setLoading(true);
      const [loanRes, emiRes] = await Promise.all([
        axios.get(`/api/loans/${loanId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`/api/payments/${loanId}/upcoming`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setLoan(loanRes.data.loan);
      setUpcomingEMIs(emiRes.data.upcomingEMIs);
      if (emiRes.data.upcomingEMIs.length > 0) {
        setSelectedEMI(emiRes.data.upcomingEMIs[0]);
        setFormData(prev => ({
          ...prev,
          amount: emiRes.data.upcomingEMIs[0].emiAmount.toString(),
        }));
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch loan data');
    } finally {
      setLoading(false);
    }
  };

  const handleEMISelect = (emi) => {
    setSelectedEMI(emi);
    setFormData(prev => ({
      ...prev,
      amount: emi.emiAmount.toString(),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEMI) {
      setError('Please select an EMI to pay');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const paymentData = {
        loanId,
        emiNumber: selectedEMI.emiNumber,
        amount: parseFloat(formData.amount),
        transactionId: formData.transactionId,
        paymentMethod: formData.paymentMethod,
      };

      const response = await axios.post('/api/payments/make-payment', paymentData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess('Payment recorded successfully!');
      setFormData({
        amount: '',
        transactionId: '',
        paymentMethod: 'online',
      });
      setTimeout(() => window.location.href = '/my-loans', 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process payment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!loan || upcomingEMIs.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-gray-700">No pending EMIs to pay.</p>
          <a href="/my-loans" className="text-blue-600 hover:underline">Back to My Loans</a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Make Payment</h1>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Select EMI to Pay</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {upcomingEMIs.map(emi => (
                <button
                  key={emi.id}
                  onClick={() => handleEMISelect(emi)}
                  className={`w-full p-4 rounded-lg border-2 transition text-left ${
                    selectedEMI?.id === emi.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-800">EMI #{emi.emiNumber}</p>
                      <p className="text-sm text-gray-600">Due: {new Date(emi.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">₹{parseFloat(emi.emiAmount).toLocaleString()}</p>
                      {emi.isOverdue && <p className="text-red-600 text-sm font-bold">Overdue</p>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedEMI && (
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiDollarSign className="inline mr-2" />Payment Amount (₹)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Due amount: ₹{parseFloat(selectedEMI.emiAmount).toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="online">Online Transfer</option>
                  <option value="cheque">Cheque</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiCreditCard className="inline mr-2" />Transaction ID
                </label>
                <input
                  type="text"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter transaction ID"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50"
              >
                {submitting ? 'Processing...' : 'Confirm Payment'}
              </button>
            </form>
          )}
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-6 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Loan Summary</h2>
          <div className="space-y-3">
            <div>
              <p className="text-gray-600 text-sm">Loan Amount</p>
              <p className="font-bold text-lg">₹{parseFloat(loan.loanAmount).toLocaleString()}</p>
            </div>
            <hr />
            <div>
              <p className="text-gray-600 text-sm">Monthly EMI</p>
              <p className="font-bold text-lg">₹{parseFloat(loan.monthlyEMI).toLocaleString()}</p>
            </div>
            <hr />
            <div>
              <p className="text-gray-600 text-sm">Paid Amount</p>
              <p className="font-bold text-lg text-green-600">₹{parseFloat(loan.paidAmount || 0).toLocaleString()}</p>
            </div>
            <hr />
            <div>
              <p className="text-gray-600 text-sm">Remaining Balance</p>
              <p className="font-bold text-lg text-orange-600">₹{parseFloat(loan.remainingBalance || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakePayment;
