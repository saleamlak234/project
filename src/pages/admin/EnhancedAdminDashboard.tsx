import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  UserCheck,
  UserX,
  Building,
  CreditCard,
  Calendar,
  BarChart3
} from 'lucide-react';
import axios from 'axios';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalDeposits: number;
  totalWithdrawals: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  totalCommissions: number;
  dailyRevenue: number;
  recentTransactions: Transaction[];
  recentUsers: User[];
  withdrawalSchedules: WithdrawalSchedule[];
}

interface Transaction {
  id: string;
  transactionType: 'deposit' | 'withdrawal' | 'commission' | 'daily_earning';
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  user: {
    fullName: string;
    email: string;
  };
  createdAt: string;
  referenceNumber: string;
}

interface WithdrawalSchedule {
  id: string;
  user: {
    fullName: string;
    email: string;
  };
  amount: number;
  scheduledDate: string;
  status: 'scheduled' | 'processing' | 'completed' | 'failed';
  paymentMethod: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  totalDeposits: number;
  createdAt: string;
}

export default function EnhancedAdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');

  useEffect(() => {
    fetchAdminStats();
  }, [selectedTimeRange]);

  const fetchAdminStats = async () => {
    try {
      const response = await axios.get(`/admin/enhanced-stats?range=${selectedTimeRange}`);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatusToggle = async (userId: string, currentStatus: boolean) => {
    try {
      await axios.put(`/admin/users/${userId}/status`, { isActive: !currentStatus });
      fetchAdminStats();
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const getWithdrawalTimeStatus = () => {
    const now = new Date();
    const hour = now.getHours();
    const isWithdrawalTime = hour >= 4 && hour < 11;
    
    return {
      isActive: isWithdrawalTime,
      message: isWithdrawalTime 
        ? `Withdrawal window is OPEN (closes at 11:00 AM)`
        : `Withdrawal window is CLOSED (opens at 4:00 AM)`
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const withdrawalStatus = getWithdrawalTimeStatus();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Enhanced Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Real-time platform monitoring and management</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Withdrawal Status Alert */}
        <div className={`mb-6 rounded-lg p-4 border ${
          withdrawalStatus.isActive 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            <Clock className={`h-5 w-5 ${
              withdrawalStatus.isActive ? 'text-green-600' : 'text-red-600'
            }`} />
            <span className={`font-medium ${
              withdrawalStatus.isActive ? 'text-green-800' : 'text-red-800'
            }`}>
              {withdrawalStatus.message}
            </span>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalUsers || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600">
                {stats?.activeUsers || 0} active users
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Daily Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(stats?.dailyRevenue || 0).toLocaleString()} ETB
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">Today's earnings</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Deposits</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.pendingDeposits || 0}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <ArrowDownRight className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-yellow-600">Awaiting review</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled Withdrawals</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.withdrawalSchedules?.length || 0}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-purple-600">For processing</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link
            to="/admin/users"
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Users</h3>
                <p className="text-sm text-gray-600">View and manage accounts</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/transactions"
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Transactions</h3>
                <p className="text-sm text-gray-600">Review all transactions</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/merchants"
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Building className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Merchants</h3>
                <p className="text-sm text-gray-600">Manage bank accounts</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/withdrawals"
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Withdrawals</h3>
                <p className="text-sm text-gray-600">Daily withdrawal queue</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
                <Link
                  to="/admin/transactions"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
                >
                  <span>View All</span>
                  <Eye className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {stats?.recentTransactions && stats.recentTransactions.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {stats.recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          transaction.transactionType === 'deposit' ? 'bg-green-100' : 
                          transaction.transactionType === 'withdrawal' ? 'bg-red-100' :
                          'bg-purple-100'
                        }`}>
                          {transaction.transactionType === 'deposit' ? (
                            <ArrowDownRight className="h-4 w-4 text-green-600" />
                          ) : transaction.transactionType === 'withdrawal' ? (
                            <ArrowUpRight className="h-4 w-4 text-red-600" />
                          ) : (
                            <DollarSign className="h-4 w-4 text-purple-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 capitalize">
                            {transaction.transactionType.replace('_', ' ')}
                          </p>
                          <p className="text-sm text-gray-600">
                            {transaction.user.fullName}
                          </p>
                          <p className="text-xs text-gray-500">
                            Ref: {transaction.referenceNumber}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.transactionType === 'deposit' || transaction.transactionType === 'commission' || transaction.transactionType === 'daily_earning'
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {transaction.transactionType === 'withdrawal' ? '-' : '+'}
                          {transaction.amount.toLocaleString()} ETB
                        </p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent transactions</p>
              </div>
            )}
          </div>

          {/* Scheduled Withdrawals */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Today's Withdrawal Queue</h2>
                <Link
                  to="/admin/withdrawals"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
                >
                  <span>Manage</span>
                  <Eye className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {stats?.withdrawalSchedules && stats.withdrawalSchedules.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {stats.withdrawalSchedules.map((withdrawal) => (
                  <div key={withdrawal.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Calendar className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{withdrawal.user.fullName}</p>
                          <p className="text-sm text-gray-600">{withdrawal.user.email}</p>
                          <p className="text-xs text-gray-500">
                            {withdrawal.paymentMethod} • {new Date(withdrawal.scheduledDate).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {withdrawal.amount.toLocaleString()} ETB
                        </p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          withdrawal.status === 'completed' ? 'bg-green-100 text-green-800' :
                          withdrawal.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          withdrawal.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {withdrawal.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No withdrawals scheduled for today</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}