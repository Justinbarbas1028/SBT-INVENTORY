import React from 'react';
import { 
  LayoutDashboard, Package, ArrowDownToLine, ArrowUpFromLine, History, Users, Truck, PackagePlus
} from 'lucide-react';
import { type LucideIcon } from 'lucide-react';
import { AppView, Role } from '../types';

interface SidebarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  role: Role;
}

export default function Sidebar({ currentView, setCurrentView, role }: SidebarProps) {
  const navItems: Array<{
    id: AppView;
    label: string;
    icon: LucideIcon;
    roles: Role[];
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Super Admin', 'Admin', 'Employee'] },
    { id: 'inventory', label: 'Inventory', icon: Package, roles: ['Super Admin', 'Admin', 'Employee'] },
    { id: 'register-item', label: 'Register Item', icon: PackagePlus, roles: ['Super Admin', 'Admin', 'Employee'] },
    { id: 'check-in', label: 'Check In', icon: ArrowDownToLine, roles: ['Super Admin', 'Admin', 'Employee'] },
    { id: 'check-out', label: 'Check Out', icon: ArrowUpFromLine, roles: ['Super Admin', 'Admin', 'Employee'] },
    { id: 'logistics', label: 'Logistics', icon: Truck, roles: ['Super Admin', 'Admin', 'Employee'] },
    { id: 'history', label: 'History', icon: History, roles: ['Super Admin', 'Admin', 'Employee'] },
    { id: 'manage-roles', label: 'Manage Roles', icon: Users, roles: ['Super Admin'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(role));

  return (
    <div className="w-64 bg-slate-900 text-white h-full flex flex-col shadow-xl md:shadow-none dark:bg-slate-950">
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-emerald-400">Simple Inventory</h1>
      </div>
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto pb-6">
        {filteredNav.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                isActive 
                  ? 'bg-emerald-600 text-white' 
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
