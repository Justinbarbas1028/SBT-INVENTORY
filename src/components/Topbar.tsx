import React from 'react';
import { Bell, Search, UserCircle, LogOut, Menu } from 'lucide-react';
import { useAppContext } from '../AppContext';

export default function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { currentUser, users, setCurrentUser } = useAppContext();

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center flex-1">
        <button onClick={onMenuClick} className="mr-3 md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg">
          <Menu size={24} />
        </button>
        <div className="hidden sm:flex items-center bg-slate-100 rounded-lg px-3 py-2 w-full max-w-md">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none ml-2 w-full text-sm"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-4 ml-4">
        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center space-x-2 md:space-x-3 border-l border-slate-200 pl-2 md:pl-4">
          <div className="text-right flex flex-col items-end">
            <p className="text-sm font-medium text-slate-700 hidden sm:block">{currentUser?.name}</p>
            <select 
              className="text-xs text-slate-500 bg-transparent outline-none cursor-pointer"
              value={currentUser?.id}
              onChange={(e) => {
                const user = users.find(u => u.id === e.target.value);
                if (user) setCurrentUser(user);
              }}
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.role}</option>
              ))}
            </select>
          </div>
          <UserCircle size={32} className="text-slate-400 shrink-0 hidden sm:block" />
          <button className="p-2 text-slate-400 hover:text-red-600 transition-colors hidden sm:block">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
