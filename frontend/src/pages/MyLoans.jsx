import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiDollarSign, FiCalendar, FiCheckCircle, FiClock } from 'react-icons/fi';
import moment from 'moment';

const MyLoans = () => {
  const { token, user } = useContext(AuthContext);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [paymentStats, setPaymentStats] = useState(null);
  const [upcomingEMIs, setUpcomingEMIs] = useState([]);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/loans/my-loans', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoans(response.data.loans);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch loans');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLoan = async (loan) => {
    setSelectedLoan(loan);
    try {
      const [statsRes, upcomingRes] = await Promise.all([
        axios.get(`/api/payments/${loan.id}/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`/api/payments/${loan.id}/upcoming`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setPaymentStats(statsRes.data);
      setUpcomingEMIs(upcomingRes.data.upcomingEMIs);
    } catch (err) {
      console.error('Error fetching loan details:', err);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      applied: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      disbursed: 'bg-purple-100 text-purple-800',
      active: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
      defaulted: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="text-center py-8">Loading loans...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Loans</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loans.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-gray-700 mb-4">You haven't applied for any loans yet.</p>
          <a href="/apply-loan" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
            Apply for Loan
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {loans.map(loan => (
              <div
                key={loan.id}
                onClick={() => handleSelectLoan(loan)}
                className={`p-6 rounded-lg shadow-lg cursor-pointer transition ${
                  selectedLoan?.id === loan.id ? 'bg-blue-50 border-2 border-blue-500' : 'bg-white hover:shadow-xl'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Loan #{loan.id.slice(0, 8)}</h3>
                    <p className="text-gray-600 text-sm">Applied on {moment(loan.applicationDate).format('MMM DD, YYYY')}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(loan.status)}`}>
                    {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Loan Amount</p>
                    <p className="font-bold text-lg">₹{parseFloat(loan.loanAmount).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Monthly EMI</p>
                    <p className="font-bold text-lg">₹{parseFloat(loan.monthlyEMI).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Paid Amount</p>
                    <p className="font-bold text-lg text-green-600">₹{parseFloat(loan.paidAmount || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Remaining</p>
                    <p className="font-bold text-lg text-orange-600">₹{parseFloat(loan.remainingBalance || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedLoan && paymentStats && (
            <div className="bg-white rounded-lg shadow-lg p-6 h-fit sticky top-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Loan Details</h2>

              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Total EMIs</p>
                  <p className="font-bold text-2xl">{paymentStats.totalEMIs}</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Paid EMIs</p>
                  <p className="font-bold text-2xl text-green-600">{paymentStats.paidEMIs}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Pending EMIs</p>
                  <p className="font-bold text-2xl text-orange-600">{paymentStats.pendingEMIs}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Completion</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-300 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${paymentStats.completionPercentage}%` }}
                      ></div>
                    </div>
                    <p className="font-bold text-lg">{paymentStats.completionPercentage}%</p>
                  </div>
                </div>
              </div>

              {upcomingEMIs.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-800 mb-3">Upcoming EMIs</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {upcomingEMIs.slice(0, 5).map(emi => (
                      <div key={emi.id} className="flex justify-between items-center text-sm border-b pb-2">
                        <span className="text-gray-600">EMI #{emi.emiNumber}</span>
                        <span className="font-semibold">₹{parseFloat(emi.emiAmount).toLocaleString()}</span>
                        <span className={emi.isOverdue ? 'text-red-600 text-xs font-bold' : 'text-gray-500 text-xs'}>
                          {emi.isOverdue ? 'Overdue' : `In ${emi.daysUntilDue} days`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <a
                href={`/make-payment/${selectedLoan.id}`}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-center block"
              >
                Make Payment
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyLoans;
