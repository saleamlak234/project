import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  User, 
  Calendar, 
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  Phone,
  CreditCard,
  X,
  Eye,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import axios from 'axios';
import ImagePreview from '../../components/ImagePreview';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  paymentMethod: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  receiptUrl?: string;
  accountDetails?: any;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  merchantAccount?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    branch: string;
  };
}

export default function AdminTransactionPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showImagePreview, setShowImagePreview] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTransaction();
    }
  }, [id]);

  const fetchTransaction = async () => {
    try {
      const response = await axios.get(`/admin/transactions/${id}`);
      setTransaction(response.data.transaction);
    } catch (error) {
      console.error('Failed to fetch transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!transaction) return;
    
    setActionLoading(true);
    try {
      await axios.put(`/admin/transactions/${transaction.id}`, {
        action: actionType,
        rejectionReason: actionType === 'reject' ? rejectionReason : undefined
      });
      
      setTransaction({
        ...transaction,
        status: actionType === 'approve' ? 'completed' : 'rejected',
        rejectionReason: actionType === 'reject' ? rejectionReason : undefined
      });
      
      setShowActionModal(false);
      setRejectionReason('');
    } catch (error) {
      console.error('Failed to update transaction:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const downloadReceipt = async () => {
    if (!transaction?.receiptUrl) return;
    
    try {
      const response = await fetch(transaction.receiptUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${transaction.id}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to direct link
      const link = document.createElement('a');
      link.href = transaction.receiptUrl;
      link.download = `receipt-${transaction.id}`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const isImage = (url: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const isPDF = (url: string) => {
    return url.toLowerCase().includes('.pdf');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Transaction Not Found</h2>
          <button
            onClick={() => navigate('/admin/transactions')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg"
          >
            Back to Transactions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/transactions')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Transactions</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Transaction Details</h1>
              <p className="text-gray-600">Review and manage transaction</p>
            </div>
          </div>
          
          {transaction.status === 'pending' && (
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setActionType('approve');
                  setShowActionModal(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  setActionType('reject');
                  setShowActionModal(true);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Reject
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transaction Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Transaction Status</h2>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(transaction.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(transaction.status)}`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
                  <p className="text-gray-900 font-mono">{transaction.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <p className="text-gray-900 capitalize">{transaction.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <p className="text-gray-900 font-semibold text-lg">
                    {transaction.amount.toLocaleString()} ETB
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                  <p className="text-gray-900">{transaction.paymentMethod}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created</label>
                  <p className="text-gray-900">
                    {new Date(transaction.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Updated</label>
                  <p className="text-gray-900">
                    {new Date(transaction.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {transaction.status === 'rejected' && transaction.rejectionReason && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-2">Rejection Reason</h4>
                  <p className="text-red-800">{transaction.rejectionReason}</p>
                </div>
              )}
            </div>

            {/* User Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">User Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium text-gray-900">{transaction.user.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-medium text-gray-900">{transaction.user.phoneNumber}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 md:col-span-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{transaction.user.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Details for Withdrawals */}
            {transaction.type === 'withdrawal' && transaction.accountDetails && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {transaction.accountDetails.bankName && (
                    <div className="flex items-center space-x-3">
                      <Building className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Bank Name</p>
                        <p className="font-medium text-gray-900">{transaction.accountDetails.bankName}</p>
                      </div>
                    </div>
                  )}
                  {transaction.accountDetails.accountNumber && (
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Account Number</p>
                        <p className="font-medium text-gray-900">{transaction.accountDetails.accountNumber}</p>
                      </div>
                    </div>
                  )}
                  {transaction.accountDetails.phoneNumber && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Phone Number</p>
                        <p className="font-medium text-gray-900">{transaction.accountDetails.phoneNumber}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Merchant Account Details for Deposits */}
            {transaction.type === 'deposit' && transaction.merchantAccount && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Merchant Account Used</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Bank Name</p>
                      <p className="font-medium text-gray-900">{transaction.merchantAccount.bankName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Account Number</p>
                      <p className="font-medium text-gray-900">{transaction.merchantAccount.accountNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Account Holder</p>
                      <p className="font-medium text-gray-900">{transaction.merchantAccount.accountHolder}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Branch</p>
                      <p className="font-medium text-gray-900">{transaction.merchantAccount.branch}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Receipt Preview */}
          <div className="lg:col-span-1">
            {transaction.receiptUrl && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 sticky top-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Receipt</h2>
                  <button
                    onClick={downloadReceipt}
                    className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                </div>
                
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {isImage(transaction.receiptUrl) ? (
                    <div className="relative group">
                      <img
                        src={transaction.receiptUrl}
                        alt="Receipt"
                        className="w-full h-auto max-h-96 object-contain cursor-pointer"
                        onClick={() => setShowImagePreview(true)}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                        <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ) : isPDF(transaction.receiptUrl) ? (
                    <div className="p-8 text-center">
                      <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <FileText className="h-8 w-8 text-red-600" />
                      </div>
                      <p className="text-gray-600 mb-4">PDF Receipt</p>
                      <a
                        href={transaction.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View PDF</span>
                      </a>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <FileText className="h-8 w-8 text-gray-600" />
                      </div>
                      <p className="text-gray-600 mb-4">File Receipt</p>
                      <a
                        href={transaction.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View File</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    {isImage(transaction.receiptUrl) ? (
                      <ImageIcon className="h-4 w-4" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                    <span>
                      {isImage(transaction.receiptUrl) ? 'Image Receipt' : 
                       isPDF(transaction.receiptUrl) ? 'PDF Receipt' : 'File Receipt'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Click to {isImage(transaction.receiptUrl) ? 'preview' : 'view'} • Right-click to save
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Image Preview Modal */}
        {showImagePreview && transaction.receiptUrl && isImage(transaction.receiptUrl) && (
          <ImagePreview
            src={transaction.receiptUrl}
            alt="Transaction Receipt"
            onClose={() => setShowImagePreview(false)}
            onDownload={downloadReceipt}
            filename={`receipt-${transaction.id}`}
          />
        )}

        {/* Action Modal */}
        {showActionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {actionType === 'approve' ? 'Approve Transaction' : 'Reject Transaction'}
                  </h2>
                  <button
                    onClick={() => setShowActionModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <p className="text-gray-600 mb-4">
                  Are you sure you want to {actionType} this transaction?
                </p>

                {actionType === 'reject' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rejection Reason *
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      rows={3}
                      placeholder="Enter reason for rejection..."
                      required
                    />
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowActionModal(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAction}
                    disabled={actionLoading || (actionType === 'reject' && !rejectionReason.trim())}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed ${
                      actionType === 'approve'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {actionLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                    ) : (
                      actionType === 'approve' ? 'Approve' : 'Reject'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}