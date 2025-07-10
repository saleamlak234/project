import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowUpRight, 
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Smartphone,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

interface Withdrawal {
  id: string;
  amount: number;
  vat: number;
  netAmount: number;
  paymentMethod: 'bank' | 'telebirr' | 'manual-transfer';
  accountDetails: {
    accountNumber?: string;
    bankName?: string;
    phoneNumber?: string;
  };
  status: 'pending' | 'completed' | 'rejected';
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
}

export default function Withdrawals() {
  const { user } = useAuth();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'bank' as 'bank' | 'telebirr' | 'manual-transfer',
    accountNumber: '',
    bankName: '',
    phoneNumber: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const response = await axios.get('/withdrawals');
      setWithdrawals(response.data.withdrawals);
    } catch (error) {
      console.error('Failed to fetch withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const amount = parseFloat(formData.amount);
    if (amount > (user?.balance || 0)) {
      setError('Insufficient balance');
      setSubmitting(false);
      return;
    }

    if (amount < 1000) {
      setError('Minimum withdrawal amount is 1,000 ETB');
      setSubmitting(false);
      return;
    }

    try {
      const withdrawalData = {
        amount,
        paymentMethod: formData.paymentMethod,
        accountDetails: formData.paymentMethod === 'bank' 
          ? {
              accountNumber: formData.accountNumber,
              bankName: formData.bankName
            }
          : {
              phoneNumber: formData.phoneNumber
            }
      };

      await axios.post('/withdrawals', withdrawalData);
      
      setShowWithdrawForm(false);
      setFormData({
        amount: '',
        paymentMethod: 'bank',
        accountNumber: '',
        bankName: '',
        phoneNumber: ''
      });
      fetchWithdrawals();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create withdrawal request');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Withdrawals</h1>
            <p className="mt-1 text-gray-600">Withdraw your earnings</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Available Balance</p>
              <p className="text-2xl font-bold text-green-600">
                {(user?.balance || 0).toLocaleString()} ETB
              </p>
            </div>
            <button
              onClick={() => setShowWithdrawForm(true)}
              disabled={(user?.balance || 0) < 1000}
              className="flex items-center px-6 py-3 space-x-2 font-medium text-white rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowUpRight className="w-5 h-5" />
              <span>Withdraw</span>
            </button>
          </div>
        </div>

        {/* Balance Warning */}
        {(user?.balance || 0) < 1000 && (
          <div className="flex items-center p-4 mb-6 space-x-2 border border-yellow-200 rounded-lg bg-yellow-50">
            <AlertCircle className="flex-shrink-0 w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800">
              Minimum withdrawal amount is 1,000 ETB. Your current balance is {(user?.balance || 0).toLocaleString()} ETB.
            </span>
          </div>
        )}

        {/* Withdrawal Form Modal */}
        {showWithdrawForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-md bg-white rounded-xl">
              <div className="p-6">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Request Withdrawal</h2>
                
                {error && (
                  <div className="p-3 mb-4 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Amount (ETB)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                        className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter amount"
                        required
                        min="1000"
                        max={user?.balance || 0}
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Available: {(user?.balance || 0).toLocaleString()} ETB
                    </p>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'bank' }))}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.paymentMethod === 'bank'
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <CreditCard className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                          <p className="font-medium text-gray-900">Bank Transfer</p>
                        </div>
                      </div>

                      <div
                        onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'telebirr' }))}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.paymentMethod === 'telebirr'
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <Smartphone className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                          <p className="font-medium text-gray-900">TeleBirr</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {formData.paymentMethod === 'bank' ? (
                    <>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          value={formData.bankName}
                          onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="e.g., Commercial Bank of Ethiopia"
                          required
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Account Number
                        </label>
                        <input
                          type="text"
                          value={formData.accountNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter your account number"
                          required
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        TeleBirr Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="+251 9XX XXX XXX"
                        required
                      />
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowWithdrawForm(false)}
                      className="flex-1 px-4 py-3 font-medium text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center justify-center flex-1 px-4 py-3 font-medium text-white rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                      ) : (
                        'Request Withdrawal'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Withdrawals List */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Withdrawal History</h2>
          </div>

          {withdrawals.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {withdrawals.map((withdrawal) => (
                <div key={withdrawal.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(withdrawal.status)}
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {withdrawal.paymentMethod === 'bank' ? 'Bank Transfer' : 'TeleBirr'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(withdrawal.createdAt).toLocaleDateString()}
                        </p>
                        {withdrawal.paymentMethod === 'bank' ? (
                          <p className="text-sm text-gray-500">
                            {withdrawal.accountDetails.bankName} • {withdrawal.accountDetails.accountNumber}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">
                            {withdrawal.accountDetails.phoneNumber}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {withdrawal.amount.toLocaleString()} ETB
                      </p>
                      <p className="text-sm text-gray-500">
                        VAT (15%): {withdrawal.vat?.toLocaleString()} ETB
                      </p>
                      <p className="text-sm font-semibold text-green-700">
                        Net: {withdrawal.netAmount?.toLocaleString()} ETB
                      </p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(withdrawal.status)}`}>
                        {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {withdrawal.status === 'rejected' && withdrawal.rejectionReason && (
                    <div className="p-3 mt-4 border border-red-200 rounded-lg bg-red-50">
                      <p className="text-sm text-red-700">
                        <strong>Rejection Reason:</strong> {withdrawal.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <ArrowUpRight className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">No withdrawals yet</h3>
              <p className="mb-6 text-gray-600">
                Your withdrawal requests will appear here
              </p>
              {(user?.balance || 0) >= 1000 && (
                <button
                  onClick={() => setShowWithdrawForm(true)}
                  className="px-6 py-3 font-medium text-white rounded-lg bg-primary-600 hover:bg-primary-700"
                >
                  Request Withdrawal
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}