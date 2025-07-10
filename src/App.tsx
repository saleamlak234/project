import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Deposits from './pages/Deposits';
import Withdrawals from './pages/Withdrawals';
import Commissions from './pages/Commissions';
import MLMTree from './pages/MLMTree';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminTransactionPreview from './pages/admin/AdminTransactionPreview';
import AdminRegister from './pages/admin/AdminRegister';
import AdminProfile from './pages/admin/AdminProfile';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" />} />
        <Route path="reset-password" element={!user ? <ResetPassword /> : <Navigate to="/dashboard" />} />
        
        {/* Protected Routes */}
        <Route path="dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="deposits" element={user ? <Deposits /> : <Navigate to="/login" />} />
        <Route path="withdrawals" element={user ? <Withdrawals /> : <Navigate to="/login" />} />
        <Route path="commissions" element={user ? <Commissions /> : <Navigate to="/login" />} />
        <Route path="mlm-tree" element={user ? <MLMTree /> : <Navigate to="/login" />} />
        
        {/* Admin Routes */}
        <Route path="admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" />} />
        <Route path="admin/users" element={user?.role === 'admin' ? <AdminUsers /> : <Navigate to="/dashboard" />} />
        <Route path="admin/transactions" element={user?.role === 'admin' ? <AdminTransactions /> : <Navigate to="/dashboard" />} />
        <Route path="admin/transactions/:id" element={user?.role === 'admin' ? <AdminTransactionPreview /> : <Navigate to="/dashboard" />} />
        <Route path="admin/register" element={user?.role === 'admin' ? <AdminRegister /> : <Navigate to="/dashboard" />} />
        <Route path="admin/profile" element={user?.role === 'admin' ? <AdminProfile /> : <Navigate to="/dashboard" />} />
      </Route>
    </Routes>
  );
}

export default App;