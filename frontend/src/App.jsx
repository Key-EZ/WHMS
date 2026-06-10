import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LandingPage from './pages/LandingPage';

// Repairs Pages
import RepairRequest from './pages/repairs/RepairRequest';
import RepairHistory from './pages/repairs/RepairHistory';
import RepairJobs from './pages/repairs/RepairJobs';
import RepairStatuses from './pages/repairs/RepairStatuses';
import RepairSettings from './pages/repairs/RepairSettings';
import RepairDashboard from './pages/repairs/RepairDashboard';

// Inventory Pages
import MyEquipment from './pages/inventory/MyEquipment';
import InventoryAssets from './pages/inventory/InventoryAssets';
import Holders from './pages/inventory/Holders';
import ItemRows from './pages/inventory/ItemRows';
import Categories from './pages/inventory/Categories';
import InventorySettings from './pages/inventory/InventorySettings';

// Settings Pages
import Users from './pages/settings/Users';
import MemberStatus from './pages/settings/MemberStatus';
import Permissions from './pages/settings/Permissions';
import GeneralSettings from './pages/settings/GeneralSettings';

const RootRoute = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return <LandingPage />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<RootRoute />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Layout Wrapper & Routes mapped to goragodwiriya-inventory original paths */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/repair-request" element={<RepairRequest />} />
          <Route path="/repair-history" element={<RepairHistory />} />
          <Route path="/repair-jobs" element={<RepairJobs />} />
          <Route path="/repair-statuses" element={<RepairStatuses />} />
          <Route path="/repair-settings" element={<RepairSettings />} />
          <Route path="/repair-dashboard" element={<RepairDashboard />} />
          
          <Route path="/inventory-myassets" element={<MyEquipment />} />
          <Route path="/inventory-assets" element={<InventoryAssets />} />
          <Route path="/inventory-holders" element={<Holders />} />
          <Route path="/inventory-items" element={<ItemRows />} />
          <Route path="/inventory-categories" element={<Categories />} />
          <Route path="/inventory-settings" element={<InventorySettings />} />
          
          <Route path="/users" element={<Users />} />
          <Route path="/user-status" element={<MemberStatus />} />
          <Route path="/permission" element={<Permissions />} />
          <Route path="/general-settings" element={<GeneralSettings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
