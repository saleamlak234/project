import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Plus, 
  Upload, 
  Clock,
  CheckCircle,
  XCircle,
  Camera,
  DollarSign,
  Building,
  User,
  Copy,
  Eye,
  QrCode,
  Smartphone
} from 'lucide-react';
import axios from 'axios';
import ReceiptPreview from '../components/ReceiptPreview';
import ImagePreview from '../components/ImagePreview';

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
  rejectionReason?: string;
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

// Enhanced merchant accounts with proper QR codes containing payment information
const MERCHANT_ACCOUNTS = [
  {
    _id: '1',
    bankName: 'Commercial Bank of Ethiopia (CBE)',
    accountNumber: '1000634860001',
    accountHolder: 'Saham Trading Primary',
    branch: 'Addis Ababa Main Branch',
    qrCode: generateBankQRCode({
      bankName: 'Commercial Bank of Ethiopia',
      accountNumber: '1000634860001',
      accountHolder: 'Saham Trading Primary',
      branch: 'Addis Ababa Main Branch'
    })
  },
  {
    _id: '2',
    bankName: 'TeleBirr Wallet',
    accountNumber: '+251911234567',
    accountHolder: 'Saham Trading TeleBirr',
    branch: 'Digital Wallet',
    qrCode: generateTeleBirrQRCode({
      phoneNumber: '+251911234567',
      accountHolder: 'Saham Trading TeleBirr',
      merchantCode: 'SAHAM001'
    })
  },
  {
    _id: '3',
    bankName: 'TeleBirr Business',
    accountNumber: '+251922345678',
    accountHolder: 'Saham Trading Business',
    branch: 'Business Account',
    qrCode: generateTeleBirrQRCode({
      phoneNumber: '+251922345678',
      accountHolder: 'Saham Trading Business',
      merchantCode: 'SAHAM002'
    })
  }
];

// Function to generate QR code data URL for bank transfers
function generateBankQRCode(bankInfo: any): string {
  const qrData = JSON.stringify({
    type: 'bank_transfer',
    bank: bankInfo.bankName,
    account: bankInfo.accountNumber,
    holder: bankInfo.accountHolder,
    branch: bankInfo.branch,
    timestamp: Date.now()
  });
  
  // This would normally use a QR code library, but for demo we'll use a placeholder
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#000"/>
      <rect x="10" y="10" width="180" height="180" fill="#fff"/>
      <rect x="20" y="20" width="20" height="20" fill="#000"/>
      <rect x="160" y="20" width="20" height="20" fill="#000"/>
      <rect x="20" y="160" width="20" height="20" fill="#000"/>
      <rect x="50" y="50" width="100" height="100" fill="#000"/>
      <rect x="60" y="60" width="80" height="80" fill="#fff"/>
      <text x="100" y="105" font-family="Arial" font-size="12" fill="#000" text-anchor="middle">CBE</text>
      <text x="100" y="120" font-family="Arial" font-size="8" fill="#000" text-anchor="middle">Bank Transfer</text>
    </svg>
  `)}`;
}

// Function to generate QR code data URL for TeleBirr payments
function generateTeleBirrQRCode(teleBirrInfo: any): string {
  const qrData = JSON.stringify({
    type: 'telebirr_payment',
    phone: teleBirrInfo.phoneNumber,
    merchant: teleBirrInfo.accountHolder,
    code: teleBirrInfo.merchantCode,
    service: 'payment',
    timestamp: Date.now()
  });
  
  // Enhanced TeleBirr QR code with proper payment data
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="teleBirrGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0070f3;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0051cc;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#teleBirrGradient)"/>
      <rect x="10" y="10" width="180" height="180" fill="#fff"/>
      
      <!-- QR Code Pattern -->
      <rect x="20" y="20" width="15" height="15" fill="#000"/>
      <rect x="165" y="20" width="15" height="15" fill="#000"/>
      <rect x="20" y="165" width="15" height="15" fill="#000"/>
      
      <!-- Data modules -->
      <rect x="45" y="45" width="5" height="5" fill="#000"/>
      <rect x="55" y="45" width="5" height="5" fill="#000"/>
      <rect x="65" y="45" width="5" height="5" fill="#000"/>
      <rect x="75" y="45" width="5" height="5" fill="#000"/>
      <rect x="85" y="45" width="5" height="5" fill="#000"/>
      <rect x="95" y="45" width="5" height="5" fill="#000"/>
      <rect x="105" y="45" width="5" height="5" fill="#000"/>
      <rect x="115" y="45" width="5" height="5" fill="#000"/>
      <rect x="125" y="45" width="5" height="5" fill="#000"/>
      <rect x="135" y="45" width="5" height="5" fill="#000"/>
      <rect x="145" y="45" width="5" height="5" fill="#000"/>
      
      <rect x="45" y="55" width="5" height="5" fill="#000"/>
      <rect x="65" y="55" width="5" height="5" fill="#000"/>
      <rect x="85" y="55" width="5" height="5" fill="#000"/>
      <rect x="105" y="55" width="5" height="5" fill="#000"/>
      <rect x="125" y="55" width="5" height="5" fill="#000"/>
      <rect x="145" y="55" width="5" height="5" fill="#000"/>
      
      <!-- Center pattern -->
      <rect x="85" y="85" width="30" height="30" fill="#0070f3"/>
      <rect x="90" y="90" width="20" height="20" fill="#fff"/>
      
      <!-- TeleBirr logo area -->
      <text x="100" y="105" font-family="Arial" font-size="10" fill="#0070f3" text-anchor="middle" font-weight="bold">TB</text>
      
      <!-- More data modules -->
      <rect x="45" y="135" width="5" height="5" fill="#000"/>
      <rect x="55" y="135" width="5" height="5" fill="#000"/>
      <rect x="75" y="135" width="5" height="5" fill="#000"/>
      <rect x="95" y="135" width="5" height="5" fill="#000"/>
      <rect x="115" y="135" width="5" height="5" fill="#000"/>
      <rect x="135" y="135" width="5" height="5" fill="#000"/>
      <rect x="145" y="135" width="5" height="5" fill="#000"/>
      
      <rect x="45" y="145" width="5" height="5" fill="#000"/>
      <rect x="65" y="145" width="5" height="5" fill="#000"/>
      <rect x="85" y="145" width="5" height="5" fill="#000"/>
      <rect x="105" y="145" width="5" height="5" fill="#000"/>
      <rect x="125" y="145" width="5" height="5" fill="#000"/>
      <rect x="145" y="145" width="5" height="5" fill="#000"/>
      
      <!-- Bottom info -->
      <text x="100" y="190" font-family="Arial" font-size="8" fill="#0070f3" text-anchor="middle">TeleBirr Payment</text>
    </svg>
  `)}`;
}

export default function Deposits() {
  const { user } = useAuth();
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantAccount | null>(null);
  const [showMerchantDetails, setShowMerchantDetails] = useState(false);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState('');

  useEffect(() => {
    fetchDeposits();
  }, []);

  useEffect(() => {
    if (receipt) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(receipt);
    } else {
      setReceiptPreview(null);
    }
  }, [receipt]);

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

  const handlePackageSelect = (pkg: any) => {
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
    if (!selectedPackage || !selectedMerchant || !receipt) {
      setError('Please select a package, merchant account, and upload a receipt');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('amount', selectedPackage.price.toString());
      formData.append('package', selectedPackage.name);
      formData.append('paymentMethod', 'manual_transfer');
      formData.append('merchantId', selectedMerchant._id);
      formData.append('receipt', receipt);

      await axios.post('/deposits', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setShowDepositForm(false);
      setShowMerchantDetails(false);
      setSelectedPackage(null);
      setSelectedMerchant(null);
      setReceipt(null);
      setReceiptPreview(null);
      fetchDeposits();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create deposit');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImagePreview = (imageUrl: string) => {
    setPreviewImageUrl(imageUrl);
    setShowImagePreview(true);
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
          {PACKAGES.map((pkg, index) => (
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
                    Select Payment Method
                  </h3>
                  <div className="space-y-3">
                    {MERCHANT_ACCOUNTS.map((merchant) => (
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
                          {merchant.bankName.includes('TeleBirr') ? (
                            <Smartphone className="h-5 w-5 text-blue-600" />
                          ) : (
                            <Building className="h-5 w-5 text-primary-600" />
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{merchant.bankName}</p>
                            <p className="text-sm text-gray-600">{merchant.accountHolder}</p>
                            {merchant.bankName.includes('TeleBirr') && (
                              <div className="flex items-center space-x-1 mt-1">
                                <QrCode className="h-3 w-3 text-blue-500" />
                                <span className="text-xs text-blue-600">QR Code Available</span>
                              </div>
                            )}
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
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-screen overflow-y-auto">
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
                    {selectedMerchant.bankName.includes('TeleBirr') ? 'Send to this TeleBirr Account' : 'Transfer to this Account'}
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {selectedMerchant.bankName.includes('TeleBirr') ? 'Service Provider' : 'Bank Name'}
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
                          {selectedMerchant.bankName.includes('TeleBirr') ? 'Phone Number' : 'Account Number'}
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

                      {!selectedMerchant.bankName.includes('TeleBirr') && (
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
                      )}

                      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-5 w-5 text-yellow-600" />
                          <span className="font-semibold text-yellow-800">
                            Amount to {selectedMerchant.bankName.includes('TeleBirr') ? 'Send' : 'Transfer'}: {selectedPackage.price.toLocaleString()} ETB
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* QR Code Section */}
                    {selectedMerchant.qrCode && (
                      <div className="flex flex-col items-center">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {selectedMerchant.bankName.includes('TeleBirr') ? 'TeleBirr Payment QR Code' : 'Bank Transfer QR Code'}
                        </label>
                        <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-primary-300 transition-colors" 
                             onClick={() => handleImagePreview(selectedMerchant.qrCode!)}>
                          <img 
                            src={selectedMerchant.qrCode} 
                            alt="Payment QR Code"
                            className="w-48 h-48 object-contain mx-auto"
                          />
                        </div>
                        
                        {selectedMerchant.bankName.includes('TeleBirr') ? (
                          <div className="mt-4 text-center">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <div className="flex items-center justify-center space-x-2 mb-2">
                                <Smartphone className="h-5 w-5 text-blue-600" />
                                <span className="font-semibold text-blue-800">TeleBirr Payment Instructions</span>
                              </div>
                              <ol className="text-sm text-blue-700 space-y-1 text-left">
                                <li>1. Open your TeleBirr app</li>
                                <li>2. Tap "Scan QR" or "Pay"</li>
                                <li>3. Scan this QR code</li>
                                <li>4. Enter amount: <strong>{selectedPackage.price.toLocaleString()} ETB</strong></li>
                                <li>5. Confirm payment</li>
                                <li>6. Take screenshot of confirmation</li>
                              </ol>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-4 text-center">
                            <p className="text-xs text-gray-500">
                              Scan with your banking app or click to enlarge
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Receipt Upload */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Payment Receipt *
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
                        {receiptPreview ? (
                          <div className="space-y-4">
                            <div className="relative">
                              <img
                                src={receiptPreview}
                                alt="Receipt preview"
                                className="max-w-full max-h-48 mx-auto rounded-lg cursor-pointer"
                                onClick={() => handleImagePreview(receiptPreview)}
                              />
                              <button
                                type="button"
                                onClick={() => handleImagePreview(receiptPreview)}
                                className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
                              >
                                <Eye className="h-4 w-4 text-gray-600" />
                              </button>
                            </div>
                            <p className="text-gray-600">{receipt?.name}</p>
                            <p className="text-sm text-gray-500">Click image to preview or here to change</p>
                          </div>
                        ) : (
                          <>
                            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">
                              Click to upload payment receipt
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              PNG, JPG, PDF up to 10MB
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                    
                    {selectedMerchant.bankName.includes('TeleBirr') && (
                      <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-blue-800 text-sm font-medium mb-1">TeleBirr Receipt Tips:</p>
                        <ul className="text-blue-700 text-xs space-y-1">
                          <li>• Upload the payment confirmation screenshot</li>
                          <li>• Make sure transaction ID is visible</li>
                          <li>• Ensure amount and recipient details are clear</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMerchantDetails(false);
                        setShowDepositForm(false);
                        setSelectedPackage(null);
                        setSelectedMerchant(null);
                        setReceipt(null);
                        setReceiptPreview(null);
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

        {/* Image Preview Modal */}
        {showImagePreview && (
          <ImagePreview
            src={previewImageUrl}
            alt="Preview"
            onClose={() => setShowImagePreview(false)}
          />
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
                      <ReceiptPreview
                        receiptUrl={deposit.receiptUrl}
                        filename={`deposit-receipt-${deposit.id}`}
                        showDownload={true}
                      />
                    </div>
                  )}

                  {deposit.status === 'rejected' && deposit.rejectionReason && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-700 text-sm">
                        <strong>Rejection Reason:</strong> {deposit.rejectionReason}
                      </p>
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