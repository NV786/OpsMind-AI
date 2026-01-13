import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen'; // We will create this below
import NotFound from './components/NotFound'; // We will create this below

// --- UTILITY: Scroll To Top on Route Change ---
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// --- UTILITY: Public Route Wrapper ---
// Prevents logged-in users from seeing the Login/Register page
function PublicOnlyRoute({ children }) {
  const { currentUser, loading } = useAuth();

  // Let the main AppContent handle the loading spinner, so we return null here
  if (loading) return null;

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// --- MAIN CONTENT WRAPPER ---
// This separates the Router context from the Auth context logic
function AppContent() {
  const { loading } = useAuth();

  // 1. GLOBAL LOADING STATE
  // Prevents "flicker" of login screen while checking if user is logged in
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication */}
        <Route
          path="/auth"
          element={
            <PublicOnlyRoute>
              <Auth />
            </PublicOnlyRoute>
          }
        />

        {/* Legacy Redirects */}
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/register" element={<Navigate to="/auth" replace />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard/*" // The /* allows nested routes inside Dashboard later
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 Not Found Handling */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}