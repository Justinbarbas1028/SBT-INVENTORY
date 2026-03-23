import React from 'react';
import { 
  LayoutDashboard, Package, ArrowDownToLine, ArrowUpFromLine, History, Users, Truck, ClipboardList, FileText
} from 'lucide-react';
import { type LucideIcon } from 'lucide-react';
import { AppView, Role } from '../types';

const logoUrl = new URL('../SBT-LOGO.png', import.meta.url).href;

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
    { id: 'request-item', label: 'Request Item', icon: ClipboardList, roles: ['Super Admin', 'Admin', 'Employee'] },
    { id: 'check-in', label: 'Check In', icon: ArrowDownToLine, roles: ['Super Admin', 'Admin', 'Employee'] },
    { id: 'check-out', label: 'Check Out', icon: ArrowUpFromLine, roles: ['Super Admin', 'Admin', 'Employee'] },
    { id: 'logistics', label: 'Logistics', icon: Truck, roles: ['Super Admin', 'Admin', 'Employee'] },
    { id: 'history', label: 'History', icon: History, roles: ['Super Admin', 'Admin', 'Employee'] },
    { id: 'request-logs', label: 'Request Logs', icon: FileText, roles: ['Super Admin'] },
    { id: 'manage-roles', label: 'Manage Roles', icon: Users, roles: ['Super Admin'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(role));

  return (
    <div className="w-64 bg-slate-900 text-white h-full flex flex-col shadow-xl md:shadow-none dark:bg-slate-950">
      <div className="h-16 px-4 border-b border-white/10 flex items-center">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 shadow-sm ring-1 ring-emerald-400/20">
            <img
              src={logoUrl}
              alt="SBT Inventory logo"
              className="h-8 w-8 object-contain shrink-0"
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-bold tracking-tight text-white leading-tight">SBT Inventory</h1>
            {/* <p className="text-[0.65rem] uppercase tracking-[0.28em] text-slate-400">Inventory Control</p> */}
          </div>
        </div>
      </div>
      <nav className="flex-1 px-4 pt-3 space-y-2 overflow-y-auto pb-6">
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
