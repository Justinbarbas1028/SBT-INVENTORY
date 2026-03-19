/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useAppContext } from './AppContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './views/Dashboard';
import RegisterItem from './views/RegisterItem';
import ScanQR from './views/ScanQR';
import Inventory from './views/Inventory';
import ItemIssuance from './views/ItemIssuance';
import MaintenanceHub from './views/MaintenanceHub';
import Logistics from './views/Logistics';
import Archive from './views/Archive';
import ManageRoles from './views/ManageRoles';

function AppContent() {
  const { currentUser } = useAppContext();
  const [currentView, setCurrentView] = useState('dashboard');

  if (!currentUser) return <div>Loading...</div>;

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'register-item': return <RegisterItem />;
      case 'scan-qr': return <ScanQR />;
      case 'inventory': return <Inventory />;
      case 'item-issuance': return <ItemIssuance />;
      case 'maintenance': return <MaintenanceHub />;
      case 'logistics': return <Logistics />;
      case 'archive': return <Archive />;
      case 'manage-roles': return <ManageRoles />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} role={currentUser.role} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

