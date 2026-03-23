/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useAppContext } from './AppContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ActionFab from './components/ActionFab';
import Dashboard from './views/Dashboard';
import Inventory from './views/Inventory';
import CheckIn from './views/CheckIn';
import CheckOut from './views/CheckOut';
import Logistics from './views/Logistics';
import History from './views/History';
import ManageRoles from './views/ManageRoles';
import RegisterItem from './views/RegisterItem';
import RequestItem from './views/RequestItem';
import { AppView } from './types';

function AppContent() {
  const { currentUser } = useAppContext();
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const fabViews: AppView[] = ['dashboard', 'inventory', 'logistics'];
  const showFab = !isSidebarOpen && fabViews.includes(currentView);

  if (!currentUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--app-bg)] text-slate-600 transition-colors dark:text-slate-300">
        Loading...
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'inventory': return <Inventory />;
      case 'check-in': return <CheckIn />;
      case 'check-out': return <CheckOut />;
      case 'register-item': return <RegisterItem />;
      case 'logistics': return <Logistics />;
      case 'history': return <History />;
      case 'manage-roles': return <ManageRoles />;
      case 'request-item': return <RequestItem />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[var(--app-bg)] text-slate-900 font-sans overflow-hidden transition-colors duration-200 dark:text-slate-100">
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
        <main className={`flex-1 overflow-y-auto ${showFab ? 'pb-24' : ''}`}>
          {renderView()}
        </main>
      </div>

      {showFab && <ActionFab onNavigate={setCurrentView} />}
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

