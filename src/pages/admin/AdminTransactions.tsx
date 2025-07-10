// ...existing code...
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download,
  Calendar,
  X,
  HelpCircle
} from 'lucide-react';
import axios from 'axios';
import AdminFileUploadHelp from './AdminFileUploadHelp';

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
  };
  receiptUrl?: string;
  accountDetails?: any;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  vat?: number;
  netAmount?: number;
}

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/admin/transactions');
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.user&&transaction.user.fullName&&transaction.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||transaction.user && transaction.user.email&& transaction.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

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
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (showHelp) {
    return <AdminFileUploadHelp />;
  }

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
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Transaction Management</h1>
              <p className="mt-1 text-gray-600">Review and manage deposits and withdrawals</p>
            </div>
            <button
              onClick={() => setShowHelp(true)}
              className="flex items-center px-4 py-2 space-x-2 text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
            >
              <HelpCircle className="w-4 h-4" />
              <span>File Upload Guide</span>
            </button>
          </div>
        </div>

        {/* Help Banner */}
        <div className="p-4 mb-6 border border-blue-200 rounded-lg bg-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-800">File Preview & Upload System</h3>
                <p className="text-sm text-blue-700">
                  Click "View" on any transaction to preview uploaded receipts with zoom, rotation, and download features.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowHelp(true)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View Full Guide →
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
              </div>
              <DollarSign className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {transactions.filter(t => t.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {transactions.filter(t => t.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {transactions.filter(t => t.status === 'rejected').length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 mb-8 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  placeholder="Search by user name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Types</option>
                <option value="deposit">Deposits</option>
                <option value="withdrawal">Withdrawals</option>
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
              
              <div className="text-sm text-gray-600">
                {filteredTransactions.length} of {transactions.length} transactions
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Receipt
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction: Transaction) => {
                  // Calculate VAT and net amount for withdrawals only
                  let vat = 0;
                  let netAmount = transaction.amount;
                  if (transaction.type === 'withdrawal') {
                    vat = Math.round(transaction.amount * 0.15);
                    netAmount = transaction.amount - vat;
                  }
                  return (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full mr-3 ${
                            transaction.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {transaction.type === 'deposit' ? (
                              <ArrowDownRight className="w-4 h-4 text-green-600" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 capitalize">
                              {transaction.type}
                            </div>
                            <div className="text-sm text-gray-500">
                              {transaction.paymentMethod}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.user.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transaction.user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'deposit' ? '+' : '-'}
                          {transaction.amount.toLocaleString()} ETB
                        </div>
                        {transaction.type === 'withdrawal' && (
                          <div className="mt-1 text-xs text-gray-500">
                            VAT: {vat.toLocaleString()} ETB<br />
                            Net: {netAmount.toLocaleString()} ETB
                          </div>
                        )}
                      </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(transaction.status)}
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.receiptUrl ? (
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="text-xs text-green-600">Available</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                            <X className="w-4 h-4 text-gray-400" />
                          </div>
                          <span className="text-xs text-gray-500">None</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      <Link
                        to={`/admin/transactions/${transaction.id}`}
                        className="flex items-center justify-end space-x-1 text-primary-600 hover:text-primary-900"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions Section */}
        <div className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Recent Transactions</h2>
          <div className="overflow-x-auto bg-white border border-gray-200 shadow-sm rounded-xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">VAT</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Net Amount</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.slice(0, 5).map((transaction: Transaction) => {
                  // For withdrawals, use backend-provided netAmount/vat if available, else calculate
                  let vat = transaction.vat ?? 0;
                  let netAmount = transaction.netAmount ?? transaction.amount;
                  if (transaction.type === 'withdrawal') {
                    if (vat === 0) {
                      vat = Math.round(transaction.amount * 0.15);
                    }
                    if (transaction.netAmount == null) {
                      netAmount = transaction.amount - vat;
                    }
                  }
                  return (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{transaction.user.fullName}</div>
                        <div className="text-xs text-gray-500">{transaction.user.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 capitalize whitespace-nowrap">{transaction.type}</td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        {transaction.type === 'deposit' ? '+' : '-'}{transaction.amount.toLocaleString()} ETB
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        {transaction.type === 'withdrawal' ? `${vat.toLocaleString()} ETB` : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        {transaction.type === 'withdrawal' ? `${netAmount.toLocaleString()} ETB` : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="p-6 mt-8 border bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl border-primary-200">
          <h3 className="mb-4 text-lg font-semibold text-primary-900">Quick Tips for File Management</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-start space-x-3">
              <Eye className="h-5 w-5 text-primary-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-primary-800">Preview Files</h4>
                <p className="text-sm text-primary-700">Click "View" to see uploaded receipts with zoom and rotation controls</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Download className="h-5 w-5 text-primary-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-primary-800">Download Options</h4>
                <p className="text-sm text-primary-700">Multiple download methods available including direct download and right-click save</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <HelpCircle className="h-5 w-5 text-primary-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-primary-800">Need Help?</h4>
                <p className="text-sm text-primary-700">Click the "File Upload Guide" button for detailed instructions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}