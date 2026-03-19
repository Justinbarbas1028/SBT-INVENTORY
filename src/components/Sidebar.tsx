import React from 'react';
import { 
  LayoutDashboard, PackagePlus, QrCode, Package, 
  ClipboardList, Wrench, Truck, Archive, Users 
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  role: string;
}

export default function Sidebar({ currentView, setCurrentView, role }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Super Admin', 'Admin', 'Employee'] },
    { id: 'register-item', label: 'Register Item', icon: PackagePlus, roles: ['Super Admin', 'Admin'] },
    { id: 'scan-qr', label: 'Scan QR', icon: QrCode, roles: ['Super Admin', 'Admin', 'Employee'] },
    { id: 'inventory', label: 'Inventory', icon: Package, roles: ['Super Admin', 'Admin', 'Employee'] },
    { id: 'item-issuance', label: 'Item Issuance', icon: ClipboardList, roles: ['Super Admin', 'Admin', 'Employee'] },
    { id: 'maintenance', label: 'Maintenance Hub', icon: Wrench, roles: ['Super Admin', 'Admin'] },
    { id: 'logistics', label: 'Logistics', icon: Truck, roles: ['Super Admin', 'Admin'] },
    { id: 'archive', label: 'Archive', icon: Archive, roles: ['Super Admin', 'Admin'] },
    { id: 'manage-roles', label: 'Manage Roles', icon: Users, roles: ['Super Admin'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(role));

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight text-indigo-400">SBT Inventory</h1>
      </div>
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {filteredNav.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                isActive 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
