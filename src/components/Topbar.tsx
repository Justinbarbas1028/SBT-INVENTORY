import React from 'react';
import { Bell, Search, UserCircle, LogOut } from 'lucide-react';
import { useAppContext } from '../AppContext';

export default function Topbar() {
  const { currentUser, users, setCurrentUser } = useAppContext();

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6">
      <div className="flex items-center bg-slate-100 rounded-lg px-3 py-2 w-96">
        <Search size={18} className="text-slate-400" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="bg-transparent border-none outline-none ml-2 w-full text-sm"
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center space-x-3 border-l border-slate-200 pl-4">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-700">{currentUser?.name}</p>
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
          <UserCircle size={32} className="text-slate-400" />
          <button className="p-2 text-slate-400 hover:text-red-600 transition-colors ml-2">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
