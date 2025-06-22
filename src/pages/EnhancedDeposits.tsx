import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Plus, 
  Upload, 
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Camera,
  DollarSign,
  QrCode,
  Copy,
  Building,
  User,
  MapPin
} from 'lucide-react';
import axios from 'axios';

interface Package {
  name: string;
  price: number;
  dailyReturn: number;
}

interface MerchantAccount {
  _id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  branch: string;
  qrCode?: string;
}

interface Deposit {
  id: string;
  amount: number;
  package: string;
  status: 'pending' | 'completed' | 'rejected';
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function EnhancedDeposits() {
  const { user } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [merchants, setMerchants] = useState<MerchantAccount[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantAccount | null>(null);
  const [showMerchantDetails, setShowMerchantDetails] = useState(false);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [packagesResponse, depositsResponse] = await Promise.all([
        axios.get('/deposits/packages'),
        axios.get('/deposits')
      ]);
      
      setPackages(packagesResponse.data.packages);
      setMerchants(packagesResponse.data.merchants);
      setDeposits(depositsResponse.data.deposits);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg);
    setShowDepositForm(true);
  };

  const handleMerchantSelect = (merchant: MerchantAccount) => {
    setSelectedMerchant(merchant);
    setShowMerchantDetails(true);
  };

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage || !selectedMerchant) return;

    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('amount', selectedPackage.price.toString());
      formData.append('package', selectedPackage.name);
      formData.append('merchantId', selectedMerchant._id);
      if (receipt) {
        formData.append('receipt', receipt);
      }

      await axios.post('/deposits/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setShowDepositForm(false);
      setShowMerchantDetails(false);
      setSelectedPackage(null);
      setSelectedMerchant(null);
      setReceipt(null);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create deposit');
    } finally {
      setSubmitting(false);
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Investment Packages</h1>
            <p className="text-gray-600 mt-1">Choose your investment package and make a deposit</p>
          </div>
        </div>

        {/* Investment Packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handlePackageSelect(pkg)}
            >
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {pkg.price.toLocaleString()} ETB
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  Daily Return: {pkg.dailyReturn.toLocaleString()} ETB
                </div>
                <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Select Package
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Package Selection Modal */}
        {showDepositForm && selectedPackage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {selectedPackage.name}
                </h2>
                
                <div className="bg-primary-50 rounded-lg p-4 mb-6">
                  <div className="text-center">
                    <p className="text-primary-800 font-semibold">Investment Amount</p>
                    <p className="text-3xl font-bold text-primary-600">
                      {selectedPackage.price.toLocaleString()} ETB
                    </p>
                    <p className="text-sm text-primary-700">
                      Daily Return: {selectedPackage.dailyReturn.toLocaleString()} ETB
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Select Merchant Account
                  </h3>
                  <div className="space-y-3">
                    {merchants.map((merchant) => (
                      <div
                        key={merchant._id}
                        onClick={() => handleMerchantSelect(merchant)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedMerchant?._id === merchant._id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Building className="h-5 w-5 text-primary-600" />
                          <div>
                            <p className="font-semibold text-gray-900">{merchant.bankName}</p>
                            <p className="text-sm text-gray-600">{merchant.accountHolder}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setShowDepositForm(false);
                      setSelectedPackage(null);
                      setSelectedMerchant(null);
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-3 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => selectedMerchant && setShowMerchantDetails(true)}
                    disabled={!selectedMerchant}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-lg font-medium disabled:opacity-50"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Merchant Details Modal */}
        {showMerchantDetails && selectedMerchant && selectedPackage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Payment Details
                </h2>

                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {/* Merchant Account Details */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Transfer to this Account
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bank Name
                        </label>
                        <div className="flex items-center justify-between p-3 bg-white rounded border">
                          <span className="font-semibold">{selectedMerchant.bankName}</span>
                          <button
                            onClick={() => copyToClipboard(selectedMerchant.bankName, 'bank')}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            {copied === 'bank' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Account Number
                        </label>
                        <div className="flex items-center justify-between p-3 bg-white rounded border">
                          <span className="font-mono font-semibold">{selectedMerchant.accountNumber}</span>
                          <button
                            onClick={() => copyToClipboard(selectedMerchant.accountNumber, 'account')}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            {copied === 'account' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Account Holder
                        </label>
                        <div className="flex items-center justify-between p-3 bg-white rounded border">
                          <span className="font-semibold">{selectedMerchant.accountHolder}</span>
                          <button
                            onClick={() => copyToClipboard(selectedMerchant.accountHolder, 'holder')}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            {copied === 'holder' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Branch
                        </label>
                        <div className="flex items-center justify-between p-3 bg-white rounded border">
                          <span>{selectedMerchant.branch}</span>
                          <button
                            onClick={() => copyToClipboard(selectedMerchant.branch, 'branch')}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            {copied === 'branch' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* QR Code */}
                    {selectedMerchant.qrCode && (
                      <div className="flex flex-col items-center">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          QR Code
                        </label>
                        <div className="bg-white p-4 rounded-lg border">
                          <img 
                            src={selectedMerchant.qrCode} 
                            alt="Payment QR Code"
                            className="w-48 h-48 object-contain"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          Scan with your banking app
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-yellow-600" />
                      <span className="font-semibold text-yellow-800">
                        Amount to Transfer: {selectedPackage.price.toLocaleString()} ETB
                      </span>
                    </div>
                  </div>
                </div>

                {/* Receipt Upload */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Payment Receipt
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => setReceipt(e.target.files?.[0] || null)}
                        className="hidden"
                        id="receipt-upload"
                        required
                      />
                      <label htmlFor="receipt-upload" className="cursor-pointer">
                        <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          {receipt ? receipt.name : 'Click to upload payment receipt'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          PNG, JPG, PDF up to 10MB
                        </p>
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMerchantDetails(false);
                        setShowDepositForm(false);
                        setSelectedPackage(null);
                        setSelectedMerchant(null);
                      }}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-3 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || !receipt}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {submitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        'Submit Deposit'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Deposits History */}
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
                          {new Date(deposit.createdAt).toLocaleDateString()}
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
                Start your investment journey by selecting a package above
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}