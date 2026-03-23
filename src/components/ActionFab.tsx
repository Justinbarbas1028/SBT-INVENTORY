import React, { useEffect, useState } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, PackagePlus, Plus, X, type LucideIcon } from 'lucide-react';
import { AppView } from '../types';

type QuickAction = {
  label: string;
  description: string;
  view: AppView;
  icon: LucideIcon;
  accent: string;
};

const quickActions: QuickAction[] = [
  {
    label: 'Check In',
    description: 'Return an item to stock',
    view: 'check-in',
    icon: ArrowDownToLine,
    accent: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  },
  {
    label: 'Check Out',
    description: 'Assign an item to someone',
    view: 'check-out',
    icon: ArrowUpFromLine,
    accent: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  },
  {
    label: 'Register Item',
    description: 'Create a new inventory record',
    view: 'register-item',
    icon: PackagePlus,
    accent: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300',
  },
];

interface ActionFabProps {
  onNavigate: (view: AppView) => void;
}

export default function ActionFab({ onNavigate }: ActionFabProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleNavigate = (view: AppView) => {
    setIsOpen(false);
    onNavigate(view);
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close quick actions"
          className="fixed inset-0 z-[60] cursor-default"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="fixed bottom-6 right-6 z-[70] flex flex-col items-end gap-3">
        {isOpen && (
          <div className="w-[min(18rem,calc(100vw-3rem))] rounded-3xl border border-slate-200 bg-white/95 p-3 shadow-2xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 animate-in fade-in slide-in-from-bottom-2">
            <div className="px-2 pb-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-400">
              Quick Actions
            </div>
            <div className="space-y-2">
              {quickActions.map(action => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.view}
                    type="button"
                    onClick={() => handleNavigate(action.view)}
                    className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${action.accent}`}>
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {action.label}
                      </span>
                      <span className="block text-xs text-slate-500 dark:text-slate-400">
                        {action.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          aria-label={isOpen ? 'Close quick actions' : 'Open quick actions'}
          aria-expanded={isOpen}
          className={`flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl ring-4 ring-emerald-500/20 transition-transform hover:scale-105 ${
            isOpen ? 'bg-slate-900' : 'bg-emerald-600'
          }`}
        >
          {isOpen ? <X size={22} /> : <Plus size={22} />}
        </button>
      </div>
    </>
  );
}
