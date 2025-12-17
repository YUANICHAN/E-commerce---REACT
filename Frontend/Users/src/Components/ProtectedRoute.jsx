import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * Redirects to login if user is not authenticated
 * Redirects to home if user tries to access login while already authenticated
 */
export const ProtectedRoute = ({ element, requiredAuth = true, requireAdmin = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in by checking for session/token
    const checkAuth = async () => {
      try {
        // Check if there's a token or session in localStorage
        const token = localStorage.getItem('authToken');
        const role = localStorage.getItem('authRole');
        const hasSession = document.cookie.includes('PHPSESSID');

        const authed = (!!token || !!hasSession);
        if (requireAdmin) {
          setIsAuthenticated(authed && role === 'admin');
        } else {
          setIsAuthenticated(authed);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // For pages that require authentication (like /account, /checkout, etc.)
  if (requiredAuth && !isAuthenticated) {
    return <Navigate to={requireAdmin ? '/admin/login' : '/login'} replace />;
  }

  // For login/register pages - redirect to home if already authenticated
  if (!requiredAuth && isAuthenticated) {
    return <Navigate to={requireAdmin ? '/admin/dashboard' : '/home'} replace />;
  }

  return element;
};

export default ProtectedRoute;
