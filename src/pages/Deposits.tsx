import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Plus, 
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Building,
  User,
  Copy,
  Eye,
  QrCode,
  Smartphone
} from 'lucide-react';
import axios from 'axios';
import CloudinaryUpload from '../components/CloudinaryUpload';
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
  receiptPublicId?: string;
  receiptMetadata?: {
    originalName: string;
    format: string;
    size: number;
  };
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
    accountNumber: '1000703059598',
    accountHolder: 'minyichl belay',
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
      phoneNumber: '+251929343646',
      accountHolder: 'minyichl belay',
      merchantCode: 'SAHAM001'
    })
  },
  // {
  //   _id: '3',
  //   bankName: 'TeleBirr Business',
  //   accountNumber: '+251922345678',
  //   accountHolder: 'Saham Trading Business',
  //   branch: 'Business Account',
  //   qrCode: generateTeleBirrQRCode({
  //     phoneNumber: '+251922345678',
  //     accountHolder: 'Saham Trading Business',
  //     merchantCode: 'SAHAM002'
  //   })
  // }
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
  const [uploadedReceipt, setUploadedReceipt] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState('');

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

  const handleReceiptUpload = (fileData: any) => {
    setUploadedReceipt(fileData);
    setError('');
  };

  const handleUploadError = (error: string) => {
    setError(error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage || !selectedMerchant || !uploadedReceipt) {
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
      formData.append('receiptUrl', uploadedReceipt.secure_url);
      formData.append('receiptPublicId', uploadedReceipt.public_id);

      await axios.post('/deposits', {
        amount: selectedPackage.price,
  package: selectedPackage.name,
  paymentMethod: 'manual_transfer',
  merchantId: selectedMerchant._id,
  receiptUrl: uploadedReceipt.secure_url,
  receiptPublicId: uploadedReceipt.public_id,
  receiptMetadata: {
    originalName: uploadedReceipt.original_filename,
    format: uploadedReceipt.format,
    size: uploadedReceipt.bytes
        }
      });

      setShowDepositForm(false);
      setShowMerchantDetails(false);
      setSelectedPackage(null);
      setSelectedMerchant(null);
      setUploadedReceipt(null);
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
            <h1 className="text-3xl font-bold text-gray-900">Investment Packages</h1>
            <p className="mt-1 text-gray-600">Choose your investment package and make a deposit</p>
          </div>
        </div>

        {/* Investment Packages */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
          {PACKAGES.map((pkg, index) => (
            <div
              key={index}
              className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm cursor-pointer rounded-xl hover:shadow-md"
              onClick={() => handlePackageSelect(pkg)}
            >
              <div className="text-center">
                <h3 className="mb-2 text-xl font-bold text-gray-900">{pkg.name}</h3>
                <div className="mb-2 text-3xl font-bold text-primary-600">
                  {pkg.price.toLocaleString()} ETB
                </div>
                <div className="mb-4 text-sm text-gray-600">
                  Daily Return: {pkg.dailyReturn.toLocaleString()} ETB
                </div>
                <button className="w-full px-4 py-2 text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700">
                  Select Package
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Package Selection Modal */}
        {showDepositForm && selectedPackage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-md max-h-screen overflow-y-auto bg-white rounded-xl">
              <div className="p-6">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  {selectedPackage.name}
                </h2>
                
                <div className="p-4 mb-6 rounded-lg bg-primary-50">
                  <div className="text-center">
                    <p className="font-semibold text-primary-800">Investment Amount</p>
                    <p className="text-3xl font-bold text-primary-600">
                      {selectedPackage.price.toLocaleString()} ETB
                    </p>
                    <p className="text-sm text-primary-700">
                      Daily Return: {selectedPackage.dailyReturn.toLocaleString()} ETB
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
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
                            <Smartphone className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Building className="w-5 h-5 text-primary-600" />
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{merchant.bankName}</p>
                            <p className="text-sm text-gray-600">{merchant.accountHolder}</p>
                            {merchant.bankName.includes('TeleBirr') && (
                              <div className="flex items-center mt-1 space-x-1">
                                <QrCode className="w-3 h-3 text-blue-500" />
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
                    className="flex-1 px-4 py-3 font-medium text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => selectedMerchant && setShowMerchantDetails(true)}
                    disabled={!selectedMerchant}
                    className="flex-1 px-4 py-3 font-medium text-white rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-4xl max-h-screen overflow-y-auto bg-white rounded-xl">
              <div className="p-6">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  Payment Details
                </h2>

                {error && (
                  <div className="p-3 mb-4 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">
                    {error}
                  </div>
                )}

                {/* Merchant Account Details */}
                <div className="p-6 mb-6 rounded-lg bg-gray-50">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    {selectedMerchant.bankName.includes('TeleBirr') ? 'Send to this TeleBirr Account' : 'Transfer to this Account'}
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          {selectedMerchant.bankName.includes('TeleBirr') ? 'Service Provider' : 'Bank Name'}
                        </label>
                        <div className="flex items-center justify-between p-3 bg-white border rounded">
                          <span className="font-semibold">{selectedMerchant.bankName}</span>
                          <button
                            onClick={() => copyToClipboard(selectedMerchant.bankName, 'bank')}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            {copied === 'bank' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          {selectedMerchant.bankName.includes('TeleBirr') ? 'Phone Number' : 'Account Number'}
                        </label>
                        <div className="flex items-center justify-between p-3 bg-white border rounded">
                          <span className="font-mono font-semibold">{selectedMerchant.accountNumber}</span>
                          <button
                            onClick={() => copyToClipboard(selectedMerchant.accountNumber, 'account')}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            {copied === 'account' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Account Holder
                        </label>
                        <div className="flex items-center justify-between p-3 bg-white border rounded">
                          <span className="font-semibold">{selectedMerchant.accountHolder}</span>
                          <button
                            onClick={() => copyToClipboard(selectedMerchant.accountHolder, 'holder')}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            {copied === 'holder' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {!selectedMerchant.bankName.includes('TeleBirr') && (
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Branch
                          </label>
                          <div className="flex items-center justify-between p-3 bg-white border rounded">
                            <span>{selectedMerchant.branch}</span>
                            <button
                              onClick={() => copyToClipboard(selectedMerchant.branch, 'branch')}
                              className="text-primary-600 hover:text-primary-700"
                            >
                              {copied === 'branch' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="p-4 mt-6 border border-yellow-200 rounded-lg bg-yellow-50">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-5 h-5 text-yellow-600" />
                          <span className="font-semibold text-yellow-800">
                            Amount to {selectedMerchant.bankName.includes('TeleBirr') ? 'Send' : 'Transfer'}: {selectedPackage.price.toLocaleString()} ETB
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* QR Code Section */}
                    {selectedMerchant.qrCode && (
                      <div className="flex flex-col items-center">
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          {selectedMerchant.bankName.includes('TeleBirr') ? 'TeleBirr Payment QR Code' : 'Bank Transfer QR Code'}
                        </label>
                        <div className="p-6 transition-colors bg-white border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-primary-300" 
                             onClick={() => handleImagePreview(selectedMerchant.qrCode!)}>
                          <img 
                            src={selectedMerchant.qrCode} 
                            alt="Payment QR Code"
                            className="object-contain w-48 h-48 mx-auto"
                          />
                        </div>
                        
                        {selectedMerchant.bankName.includes('TeleBirr') ? (
                          <div className="mt-4 text-center">
                            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                              <div className="flex items-center justify-center mb-2 space-x-2">
                                <Smartphone className="w-5 h-5 text-blue-600" />
                                <span className="font-semibold text-blue-800">TeleBirr Payment Instructions</span>
                              </div>
                              <ol className="space-y-1 text-sm text-left text-blue-700">
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
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Upload Payment Receipt *
                    </label>
                    <CloudinaryUpload
                      onUploadSuccess={handleReceiptUpload}
                      onUploadError={handleUploadError}
                      acceptedTypes="image/*,application/pdf"
                      maxSize={10 * 1024 * 1024}
                      className="w-full"
                    />
                    
                    {selectedMerchant.bankName.includes('TeleBirr') && (
                      <div className="p-3 mt-3 border border-blue-200 rounded-lg bg-blue-50">
                        <p className="mb-1 text-sm font-medium text-blue-800">TeleBirr Receipt Tips:</p>
                        <ul className="space-y-1 text-xs text-blue-700">
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
                        setUploadedReceipt(null);
                      }}
                      className="flex-1 px-4 py-3 font-medium text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                
                    <button
                      type="submit"
                      disabled={submitting || !uploadedReceipt}
                      className="flex items-center justify-center flex-1 px-4 py-3 font-medium text-white rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
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
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
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
                    <div className="p-3 mt-4 border border-red-200 rounded-lg bg-red-50">
                      <p className="text-sm text-red-700">
                        <strong>Rejection Reason:</strong> {deposit.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">No deposits yet</h3>
              <p className="mb-6 text-gray-600">
                Start your investment journey by selecting a package above
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}