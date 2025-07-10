import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Award, 
  ArrowUpRight, 
  ArrowDownRight,
  Eye,
  Copy,
  CheckCircle
} from 'lucide-react';
import axios from 'axios';

interface DashboardStats {
  totalBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalCommissions: number;
  monthlyEarnings: number;
  directReferrals: number;
  totalTeamSize: number;
  recentTransactions: Transaction[];
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'commission';
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  createdAt: string;
  description?: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReferralCode, setShowReferralCode] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = async () => {
    if (user?.referralCode) {
      await navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyReferralLink = async () => {
    const referralLink = `${window.location.origin}/register?ref=${user?.referralCode}`;
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's an overview of your investment portfolio and earnings
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(stats?.totalBalance || user?.balance || 0).toLocaleString()} ETB
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">Available for withdrawal</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Deposits</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(stats?.totalDeposits || user?.totalDeposits || 0).toLocaleString()} ETB
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">Total invested amount</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Commissions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(stats?.totalCommissions || user?.totalCommissions || 0).toLocaleString()} ETB
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-purple-600">From referral network</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Team Size</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalTeamSize || user?.totalTeamSize || 0}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">
                {stats?.directReferrals || user?.directReferrals || 0} direct referrals
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Referral Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Referral Program</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Referral Code
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      <span className="font-mono text-lg font-semibold text-primary-600">
                        {showReferralCode ? user?.referralCode : '••••••••'}
                      </span>
                    </div>
                    <button
                      onClick={() => setShowReferralCode(!showReferralCode)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={copyReferralCode}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      {copied ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={copyReferralLink}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {copied ? 'Link Copied!' : 'Copy Referral Link'}
                </button>

                <div className="bg-gradient-to-r from-gold-50 to-gold-100 rounded-lg p-4">
                  <h4 className="font-semibold text-gold-800 mb-2">Commission Structure</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gold-700">Level 1:</span>
                      <span className="font-semibold text-gold-800">8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gold-700">Level 2:</span>
                      <span className="font-semibold text-gold-800">4%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gold-700">Level 3:</span>
                      <span className="font-semibold text-gold-800">2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gold-700">Level 4:</span>
                      <span className="font-semibold text-gold-800">1%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
              
              {stats?.recentTransactions && stats.recentTransactions.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'deposit' ? 'bg-green-100' :
                          transaction.type === 'withdrawal' ? 'bg-red-100' :
                          'bg-purple-100'
                        }`}>
                          {transaction.type === 'deposit' ? (
                            <ArrowDownRight className={`h-4 w-4 ${
                              transaction.type === 'deposit' ? 'text-green-600' : ''
                            }`} />
                          ) : transaction.type === 'withdrawal' ? (
                            <ArrowUpRight className="h-4 w-4 text-red-600" />
                          ) : (
                            <Award className="h-4 w-4 text-purple-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 capitalize">
                            {transaction.type}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'deposit' || transaction.type === 'commission' 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {transaction.type === 'withdrawal' ? '-' : '+'}
                          {transaction.amount.toLocaleString()} ETB
                        </p>
                        <p className={`text-xs ${
                          transaction.status === 'completed' ? 'text-green-600' :
                          transaction.status === 'pending' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {transaction.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No transactions yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Make your first deposit to start earning
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}