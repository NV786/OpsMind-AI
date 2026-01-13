import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from './LoadingScreen'; // Reuse the beautiful loader we created

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // 1. Show the professional loading screen while checking auth status
  if (loading) {
    return <LoadingScreen />;
  }

  // 2. If not logged in, redirect to /auth
  // We pass "state={{ from: location }}" so we can redirect them back 
  // to the requested page after they log in (a nice UX touch).
  if (!currentUser) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // 3. Render the protected content (Dashboard)
  return children;
}