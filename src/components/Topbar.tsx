import React from 'react';
import { Bell, Search, UserCircle, LogOut, Menu, Moon, Sun, TriangleAlert } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { getNextTheme, getThemeToggleLabel } from '../theme';

export default function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { currentUser, users, setCurrentUser, theme, setTheme } = useAppContext();
  const nextTheme = getNextTheme(theme);
  const nextThemeLabel = getThemeToggleLabel(theme);

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-6 shrink-0 transition-colors">
      <div className="flex items-center flex-1">
        <button onClick={onMenuClick} className="mr-3 md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg">
          <Menu size={24} />
        </button>
        <div className="hidden sm:flex items-center bg-slate-100 rounded-lg px-3 py-2 w-full max-w-md">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search..."
            className="bg-transparent border-none outline-none ml-2 w-full text-sm text-slate-700 placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-4 ml-4">
        <button
          type="button"
          onClick={() => setTheme(nextTheme)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-slate-700 transition-colors hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          aria-label={`Switch to ${nextThemeLabel} mode`}
          aria-pressed={theme === 'dark' || theme === 'pain'}
          title={`Switch to ${nextThemeLabel} mode`}
        >
          {theme === 'light' ? <Moon size={18} /> : theme === 'dark' ? <TriangleAlert size={18} /> : <Sun size={18} />}
          <span className="hidden lg:inline text-sm font-medium">
            {nextThemeLabel}
          </span>
        </button>

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
