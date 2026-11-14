import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardOverview } from './pages/DashboardOverview';
import { FacebookAccountsPage } from './pages/FacebookAccountsPage';
import { DesignStudioPage } from './pages/DesignStudioPage';
import { ContentCalendarPage } from './pages/ContentCalendarPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Core Clean Navigation Pages */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="facebook-accounts" element={<FacebookAccountsPage />} />
          <Route path="social-accounts" element={<FacebookAccountsPage />} />
          <Route path="design-studio" element={<DesignStudioPage />} />
          <Route path="content-calendar" element={<ContentCalendarPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
