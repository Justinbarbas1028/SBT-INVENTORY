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
import { QrCode } from 'lucide-react';

function AppContent() {
  const { currentUser } = useAppContext();
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out`}>
        <Sidebar 
          currentView={currentView} 
          setCurrentView={(view) => { setCurrentView(view); setIsSidebarOpen(false); }} 
          role={currentUser.role} 
        />
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full min-w-0 relative">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>

        {/* Floating Action Button for QR Scan */}
        <button
          onClick={() => setCurrentView('scan-qr')}
          className="absolute bottom-6 right-6 p-4 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 hover:shadow-xl transition-all z-40 flex items-center justify-center"
          title="Scan QR Code"
        >
          <QrCode size={28} />
        </button>
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

