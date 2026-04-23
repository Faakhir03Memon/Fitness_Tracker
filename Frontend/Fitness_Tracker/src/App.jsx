import React, { useState, useEffect } from 'react';
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
import AdminDashboard from './pages/Admin/AdminDashboard';
import Layout from './components/Layout';
import Loader from './components/Loader';
import SplashScreen from './components/SplashScreen';
import './App.css';

const FullPageLoader = () => (
  <div style={{ 
    height: '100vh', 
    width: '100vw', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    background: 'var(--bg-primary)'
  }}>
    <Loader />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <FullPageLoader />;
  
  // If no user, strictly go to login
  if (!user) return <Navigate to="/login" replace />;
  
  // If user is admin, they shouldn't be in user routes
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <FullPageLoader />;
  
  // If no user, strictly go to login
  if (!user) return <Navigate to="/login" replace />;
  
  // If user is not admin, kick them to dashboard
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <FullPageLoader />;
  
  // If already logged in, take them to their respective dashboard
  if (user) {
    return user.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AuthProvider>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <Router>
        <Routes>
          {/* Entry Point - Always go to Login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public Routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected User Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/workouts" element={<ProtectedRoute><Layout><Workouts /></Layout></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><Layout><Progress /></Layout></ProtectedRoute>} />
          <Route path="/nutrition" element={<ProtectedRoute><Layout><Nutrition /></Layout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          
          {/* Catch-all Route - Redirect to Login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
