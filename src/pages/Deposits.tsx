import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Plus, 
  Upload, 
  CreditCard,
  Smartphone,
  Clock,
  CheckCircle,
  XCircle,
  Camera,
  DollarSign
} from 'lucide-react';
import axios from 'axios';

interface Deposit {
  id: string;
  amount: number;
  package: string;
  paymentMethod: 'chapa_cbe' | 'chapa_telebirr';
  status: 'pending' | 'completed' | 'rejected';
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const PACKAGES = [
  { name: '7th Stock Package', price: 192000, dailyReturn: 3200 },
  { name: '6th Stock Package', price: 96000, dailyReturn: 1600 },
  { name: '5th Stock Package', price: 48000, dailyReturn: 800 },
  { name: '4th Stock Package', price: 24000, dailyReturn: 400 },
  { name: '3rd Stock Package', price: 12000, dailyReturn: 200 },
  { name: '2nd Stock Package', price: 6000, dailyReturn: 100 },
  { name: '1st Stock Package', price: 3000, dailyReturn: 50 }
];

export default function Deposits() {
  const { user } = useAuth();
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    package: '',
    paymentMethod: 'chapa_cbe' as 'chapa_cbe' | 'chapa_telebirr'
  });
  const [receipt, setReceipt] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      const response = await axios.get('/deposits');
      setDeposits(response.data.deposits);
    } catch (error) {
      console.error('Failed to fetch deposits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('amount', formData.amount);
      formDataToSend.append('package', formData.package);
      formDataToSend.append('paymentMethod', formData.paymentMethod);
      if (receipt) {
        formDataToSend.append('receipt', receipt);
      }

      const response = await axios.post('/deposits', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Handle Chapa payment redirect if needed
      if (response.data.checkout_url) {
        window.location.href = response.data.checkout_url;
      } else {
        setShowDepositForm(false);
        setFormData({ amount: '', package: '', paymentMethod: 'chapa_cbe' });
        setReceipt(null);
        fetchDeposits();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create deposit');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePackageSelect = (pkg: any) => {
    setFormData(prev => ({
      ...prev,
      amount: pkg.price.toString(),
      package: pkg.name
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Deposits</h1>
            <p className="text-gray-600 mt-1">Manage your investment deposits</p>
          </div>
          <button
            onClick={() => setShowDepositForm(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>New Deposit</span>
          </button>
        </div>

        {/* Deposit Form Modal */}
        {showDepositForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Make a Deposit</h2>
                
                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {/* Package Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Package</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {PACKAGES.map((pkg, index) => (
                      <div
                        key={index}
                        onClick={() => handlePackageSelect(pkg)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.package === pkg.name
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <h4 className="font-semibold text-gray-900">{pkg.name}</h4>
                        <p className="text-2xl font-bold text-primary-600 mt-1">
                          {pkg.price.toLocaleString()} ETB
                        </p>
                        <p className="text-sm text-gray-600">
                          dailyReturn Return: {pkg.dailyReturn.toLocaleString()} ETB
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount (ETB)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter amount"
                        required
                        min="1000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'chapa_cbe' }))}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.paymentMethod === 'chapa_cbe'
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <CreditCard className="h-6 w-6 text-primary-600" />
                          <div>
                            <h4 className="font-semibold text-gray-900">CBE Banking</h4>
                            <p className="text-sm text-gray-600">Commercial Bank of Ethiopia</p>
                          </div>
                        </div>
                      </div>

                      <div
                        onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'chapa_telebirr' }))}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.paymentMethod === 'chapa_telebirr'
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Smartphone className="h-6 w-6 text-primary-600" />
                          <div>
                            <h4 className="font-semibold text-gray-900">TeleBirr</h4>
                            <p className="text-sm text-gray-600">Mobile payment</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Receipt (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setReceipt(e.target.files?.[0] || null)}
                        className="hidden"
                        id="receipt-upload"
                      />
                      <label htmlFor="receipt-upload" className="cursor-pointer">
                        <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          {receipt ? receipt.name : 'Click to upload payment receipt'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          PNG, JPG up to 10MB
                        </p>
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowDepositForm(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-3 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {submitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        'Create Deposit'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Deposits List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Deposit History</h2>
          </div>

          {deposits.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {deposits.map((deposit) => (
                <div key={deposit.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(deposit.status)}
                      <div>
                        <h3 className="font-semibold text-gray-900">{deposit.package}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(deposit.createdAt).toLocaleDateString()} • 
                          {deposit.paymentMethod === 'chapa_cbe' ? ' CBE Banking' : ' TeleBirr'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {deposit.amount.toLocaleString()} ETB
                      </p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(deposit.status)}`}>
                        {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {deposit.receiptUrl && (
                    <div className="mt-4">
                      <a
                        href={deposit.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 text-sm flex items-center space-x-1"
                      >
                        <Upload className="h-4 w-4" />
                        <span>View Receipt</span>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No deposits yet</h3>
              <p className="text-gray-600 mb-6">
                Start your investment journey by making your first deposit
              </p>
              <button
                onClick={() => setShowDepositForm(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                Make First Deposit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}