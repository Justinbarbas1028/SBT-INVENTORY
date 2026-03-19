/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useAppContext } from './AppContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './views/Dashboard';
import Inventory from './views/Inventory';
import CheckIn from './views/CheckIn';
import CheckOut from './views/CheckOut';
import History from './views/History';
import ManageRoles from './views/ManageRoles';

function AppContent() {
  const { currentUser } = useAppContext();
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!currentUser) return <div>Loading...</div>;

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'inventory': return <Inventory />;
      case 'check-in': return <CheckIn />;
      case 'check-out': return <CheckOut />;
      case 'history': return <History />;
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

