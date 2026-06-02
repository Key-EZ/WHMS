import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LandingPage from './pages/LandingPage';

// Placeholder pages
const Transactions = () => <div className="p-8 rounded-[30px] bg-[#e0e5ec] shadow-[15px_15px_30px_#bec3cf,-15px_-15px_30px_#ffffff] text-[#3d4468]">Transactions Page (Coming Soon)</div>;
const Settings = () => <div className="p-8 rounded-[30px] bg-[#e0e5ec] shadow-[15px_15px_30px_#bec3cf,-15px_-15px_30px_#ffffff] text-[#3d4468]">System Settings Page (Coming Soon)</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected App Routes */}
        <Route path="/app" element={<Layout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
