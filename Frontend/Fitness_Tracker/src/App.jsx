import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import Progress from './pages/Progress';
import Nutrition from './pages/Nutrition';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Layout from './components/Layout';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'admin') return <Navigate to="/admin" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/" />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (user) {
    return user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/" />;
  }
  return children;
};

const HomeRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return user.role === 'admin' ? <Navigate to="/admin" /> : <Layout><Dashboard /></Layout>;
};

const FallbackRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          {/* Protected User Routes */}
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/workouts" element={<ProtectedRoute><Layout><Workouts /></Layout></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><Layout><Progress /></Layout></ProtectedRoute>} />
          <Route path="/nutrition" element={<ProtectedRoute><Layout><Nutrition /></Layout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          
          {/* Catch-all Route */}
          <Route path="*" element={<FallbackRoute />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
