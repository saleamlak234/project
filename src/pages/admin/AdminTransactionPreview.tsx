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
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Clock className="w-6 h-6 text-yellow-500" />;
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-primary-600"></div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Transaction Not Found</h2>
          <button
            onClick={() => navigate('/admin/transactions')}
            className="px-4 py-2 text-white rounded-lg bg-primary-600 hover:bg-primary-700"
          >
            Back to Transactions
          </button>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/transactions')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Transactions</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Transaction Details</h1>
              <p className="text-gray-600">Review and manage transaction</p>
            </div>
          </div>

          {/* Only show approve/reject if transaction is pending */}
          {transaction.status === 'pending' && (
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setActionType('approve');
                  setShowActionModal(true);
                }}
                className="px-4 py-2 font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  setActionType('reject');
                  setShowActionModal(true);
                }}
                className="px-4 py-2 font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Transaction Details */}
          <div className="space-y-6 lg:col-span-2">
            {/* Status Card */}
            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Transaction Status</h2>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(transaction.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(transaction.status)}`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
                  <p className="font-mono text-gray-900">{transaction.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <p className="text-gray-900 capitalize">{transaction.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <p className="text-lg font-semibold text-gray-900">
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
                <div className="p-4 mt-4 border border-red-200 rounded-lg bg-red-50">
                  <h4 className="mb-2 font-medium text-red-900">Rejection Reason</h4>
                  <p className="text-red-800">{transaction.rejectionReason}</p>
                </div>
              )}
            </div>

            {/* User Information */}
            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">User Information</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium text-gray-900">{transaction.user.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-medium text-gray-900">{transaction.user.phoneNumber}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 md:col-span-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{transaction.user.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Details for Withdrawals */}
            {transaction.type === 'withdrawal' && transaction.accountDetails && (
              <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">Account Details</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {transaction.accountDetails.bankName && (
                    <div className="flex items-center space-x-3">
                      <Building className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Bank Name</p>
                        <p className="font-medium text-gray-900">{transaction.accountDetails.bankName}</p>
                      </div>
                    </div>
                  )}
                  {transaction.accountDetails.accountNumber && (
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Account Number</p>
                        <p className="font-medium text-gray-900">{transaction.accountDetails.accountNumber}</p>
                      </div>
                    </div>
                  )}
                  {transaction.accountDetails.phoneNumber && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
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
              <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">Merchant Account Used</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex items-center space-x-3">
                    <Building className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Bank Name</p>
                      <p className="font-medium text-gray-900">{transaction.merchantAccount.bankName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Account Number</p>
                      <p className="font-medium text-gray-900">{transaction.merchantAccount.accountNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Account Holder</p>
                      <p className="font-medium text-gray-900">{transaction.merchantAccount.accountHolder}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Building className="w-5 h-5 text-gray-400" />
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
              <div className="sticky p-6 bg-white border border-gray-200 shadow-sm rounded-xl top-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Receipt</h2>
                  <button
                    onClick={downloadReceipt}
                    className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
                
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  {isImage(transaction.receiptUrl) ? (
                    <div className="relative group">
                      <img
                        src={transaction.receiptUrl}
                        alt="Receipt"
                        className="object-contain w-full h-auto cursor-pointer max-h-96"
                        onClick={() => setShowImagePreview(true)}
                      />
                      <div className="absolute inset-0 flex items-center justify-center transition-all bg-black bg-opacity-0 group-hover:bg-opacity-20">
                        <Eye className="w-8 h-8 text-white transition-opacity opacity-0 group-hover:opacity-100" />
                      </div>
                    </div>
                  ) : isPDF(transaction.receiptUrl) ? (
                    <div className="p-8 text-center">
                      <div className="flex items-center justify-center w-16 h-16 p-4 mx-auto mb-4 bg-red-100 rounded-full">
                        <FileText className="w-8 h-8 text-red-600" />
                      </div>
                      <p className="mb-4 text-gray-600">PDF Receipt</p>
                      <a
                        href={transaction.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 space-x-2 text-white rounded-lg bg-primary-600 hover:bg-primary-700"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View PDF</span>
                      </a>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="flex items-center justify-center w-16 h-16 p-4 mx-auto mb-4 bg-gray-100 rounded-full">
                        <FileText className="w-8 h-8 text-gray-600" />
                      </div>
                      <p className="mb-4 text-gray-600">File Receipt</p>
                      <a
                        href={transaction.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 space-x-2 text-white rounded-lg bg-primary-600 hover:bg-primary-700"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View File</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="p-3 mt-4 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    {isImage(transaction.receiptUrl) ? (
                      <ImageIcon className="w-4 h-4" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                    <span>
                      {isImage(transaction.receiptUrl) ? 'Image Receipt' : 
                       isPDF(transaction.receiptUrl) ? 'PDF Receipt' : 'File Receipt'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-md bg-white rounded-xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {actionType === 'approve' ? 'Approve Transaction' : 'Reject Transaction'}
                  </h2>
                  <button
                    onClick={() => setShowActionModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <p className="mb-4 text-gray-600">
                  Are you sure you want to {actionType} this transaction?
                </p>

                {actionType === 'reject' && (
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
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
                    className="flex-1 px-4 py-2 font-medium text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300"
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
                      <div className="w-5 h-5 mx-auto border-2 border-white rounded-full border-t-transparent animate-spin"></div>
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