import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { TrendingUp, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Lockout UI state
  const [lockoutInfo, setLockoutInfo] = useState<{
    isLocked: boolean;
    remainingMinutes: number;
    attemptsRemaining?: number;
  } | null>(null);
  const {user}=useAuth()
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setError('');
    setLockoutInfo(null);


    try {
      await login(formData.email, formData.password);
      if(user?.role === 'admin'){
        navigate('/admin');
      } else{
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      // Type guard for axios error
      const errorData = (err as unknown as { response?: { data?: { [key: string]: unknown } } })?.response?.data;
      if (errorData?.remainingMinutes !== undefined) {
        setLockoutInfo({
          isLocked: true,
          remainingMinutes: errorData.remainingMinutes
        });
        setError(typeof errorData?.message === 'string' ? errorData.message : 'Account is temporarily locked');
      } else if (errorData?.attemptsRemaining !== undefined) {
        setLockoutInfo({
          isLocked: false,
          remainingMinutes: 0,
          attemptsRemaining: errorData.attemptsRemaining
        });
        setError(typeof errorData?.message === 'string' ? errorData.message : 'Invalid credentials');
      } else {
        setError(typeof errorData?.message === 'string' ? errorData.message : 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Format lockout time
  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes > 0 ? `and ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}` : ''}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-primary-50 to-primary-100 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6 space-x-2">
            <TrendingUp className="w-12 h-12 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">Saham Trading</span>
          </div>
          <h2 className="mb-2 text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your investment account</p>
        </div>

        <div className="p-8 bg-white shadow-xl rounded-2xl">






     

          {/* Account Locked Warning */}
          {lockoutInfo?.isLocked && (
            <div className="p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
              <div className="flex items-center mb-2 space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="font-medium text-red-800">Account Temporarily Locked</span>
              </div>
              <div className="flex items-center space-x-2 text-red-700">
                <span className="text-sm">
                  Please try again in {formatTime(lockoutInfo.remainingMinutes)}
                </span>
              </div>
              <p className="mt-2 text-xs text-red-600">
                This security measure protects your account from unauthorized access attempts.
              </p>
            </div>
          )}

          {/* Login Attempts Warning */}
          {lockoutInfo && !lockoutInfo.isLocked && lockoutInfo.attemptsRemaining !== undefined && lockoutInfo.attemptsRemaining <= 2 && (
            <div className="p-4 mb-6 border border-yellow-200 rounded-lg bg-yellow-50">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <span className="font-medium text-yellow-800">Security Warning</span>
              </div>
              <p className="mt-1 text-sm text-yellow-700">
                {lockoutInfo.attemptsRemaining} attempt{lockoutInfo.attemptsRemaining !== 1 ? 's' : ''} remaining before account lockout
              </p>
            </div>
          )}

          {error && !lockoutInfo?.isLocked && (
            <div className="flex items-center p-4 mb-6 space-x-2 border border-red-200 rounded-lg bg-red-50">
              <AlertCircle className="flex-shrink-0 w-5 h-5 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled={lockoutInfo?.isLocked}
                  className="block w-full py-3 pl-10 pr-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={lockoutInfo?.isLocked}
                  className="block w-full py-3 pl-10 pr-10 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={lockoutInfo?.isLocked}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  disabled={lockoutInfo?.isLocked}
                  className="w-4 h-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500 disabled:cursor-not-allowed"
                />
                <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading || lockoutInfo?.isLocked}
              className="flex items-center justify-center w-full px-4 py-3 font-semibold text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
              ) : lockoutInfo?.isLocked ? (
                'Account Locked'
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                Sign up now
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <a href="#" className="text-primary-600 hover:text-primary-500">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-primary-600 hover:text-primary-500">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}