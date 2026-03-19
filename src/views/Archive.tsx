import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { RotateCcw, Package, Users } from 'lucide-react';

export default function Archive() {
  const { items, setItems, users, setUsers } = useAppContext();
  const [activeTab, setActiveTab] = useState<'items' | 'users'>('items');

  const archivedItems = items.filter(i => i.status === 'Archived');
  const archivedUsers = users.filter(u => u.status === 'Archived');

  const handleRestoreItem = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, status: 'Available' } : i));
  };

  const handleRestoreUser = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: 'Active' } : u));
  };

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Archive</h2>

      <div className="flex flex-col sm:flex-row gap-2 sm:space-x-4 mb-6">
        <button 
          onClick={() => setActiveTab('items')}
          className={`flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl font-medium transition-colors ${
            activeTab === 'items' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Package size={18} />
          <span>Archived Items</span>
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl font-medium transition-colors ${
            activeTab === 'users' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Users size={18} />
          <span>Archived Users</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {activeTab === 'items' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                  <th className="p-4 font-medium">Item ID</th>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Date Added</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {archivedItems.map(item => (
                  <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-mono text-sm text-slate-600 whitespace-nowrap">{item.id}</td>
                    <td className="p-4 font-medium text-slate-800 whitespace-nowrap">{item.name}</td>
                    <td className="p-4 text-slate-600 whitespace-nowrap">{item.category}</td>
                    <td className="p-4 text-slate-500 text-sm whitespace-nowrap">{item.dateAdded}</td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <button 
                        onClick={() => handleRestoreItem(item.id)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-sm font-medium transition-colors"
                      >
                        <RotateCcw size={16} />
                        <span>Restore</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {archivedItems.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">No archived items found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                  <th className="p-4 font-medium">User ID</th>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {archivedUsers.map(user => (
                  <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-mono text-sm text-slate-600 whitespace-nowrap">{user.id}</td>
                    <td className="p-4 font-medium text-slate-800 whitespace-nowrap">{user.name}</td>
                    <td className="p-4 text-slate-600 whitespace-nowrap">{user.role}</td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <button 
                        onClick={() => handleRestoreUser(user.id)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-sm font-medium transition-colors"
                      >
                        <RotateCcw size={16} />
                        <span>Restore</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {archivedUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">No archived users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
