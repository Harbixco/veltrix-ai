import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ContentCalendarPage } from './pages/ContentCalendarPage';
import { LoginPage } from './pages/LoginPage';

/**
 * Route guard: Redirects to /login if the user does not have an active authentication session.
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const token = typeof window !== 'undefined' ? localStorage.getItem('veltrix_token') : null;

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

/**
 * Public-only route guard: If the user is already authenticated, redirect them to the dashboard.
 */
const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('veltrix_token') : null;

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login Route */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />

        {/* Protected Dashboard Routes (Requires Authentication) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/content-calendar" replace />} />
          <Route path="overview" element={<Navigate to="/content-calendar" replace />} />
          <Route path="facebook-accounts" element={<Navigate to="/content-calendar" replace />} />
          <Route path="social-accounts" element={<Navigate to="/content-calendar" replace />} />
          <Route path="design-studio" element={<Navigate to="/content-calendar" replace />} />
          <Route path="content-calendar" element={<ContentCalendarPage />} />
          <Route path="reports" element={<Navigate to="/content-calendar" replace />} />
          <Route path="settings" element={<Navigate to="/content-calendar" replace />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
