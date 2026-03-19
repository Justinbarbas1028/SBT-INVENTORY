import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { UserPlus, Edit2, KeyRound, Archive as ArchiveIcon } from 'lucide-react';
import { Role } from '../types';

export default function ManageRoles() {
  const { users, setUsers } = useAppContext();
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Employee' as Role, employeeNumber: '' });

  const activeUsers = users.filter(u => u.status === 'Active');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const u = {
      id: `USR-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      ...newUser,
      status: 'Active' as const
    };
    setUsers([...users, u]);
    setShowAdd(false);
    setNewUser({ name: '', email: '', role: 'Employee', employeeNumber: '' });
  };

  const handleArchive = (id: string) => {
    if (confirm('Are you sure you want to archive this user?')) {
      setUsers(users.map(u => u.id === id ? { ...u, status: 'Archived' } : u));
    }
  };

  const handleResetPassword = (name: string) => {
    alert(`Password reset link sent to ${name}'s email.`);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Manage Roles & Accounts</h2>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
        >
          <UserPlus size={18} />
          <span>Create Account</span>
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8 max-w-2xl">
          <h3 className="text-lg font-bold text-slate-800 mb-4">New Employee Account</h3>
          <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input 
                required
                type="text" 
                value={newUser.name}
                onChange={e => setNewUser({...newUser, name: e.target.value})}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input 
                required
                type="email" 
                value={newUser.email}
                onChange={e => setNewUser({...newUser, email: e.target.value})}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Employee Number</label>
              <input 
                required
                type="text" 
                value={newUser.employeeNumber}
                onChange={e => setNewUser({...newUser, employeeNumber: e.target.value})}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
              <select 
                value={newUser.role}
                onChange={e => setNewUser({...newUser, role: e.target.value as Role})}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Employee">Employee</option>
                <option value="Admin">Admin</option>
                <option value="Super Admin">Super Admin</option>
              </select>
            </div>
            <div className="md:col-span-2 pt-2">
              <button type="submit" className="w-full py-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                  <th className="p-4 font-medium">Employee Info</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeUsers.map(user => (
                  <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800">{user.name}</span>
                        <span className="text-sm text-slate-500">{user.email} • {user.employeeNumber}</span>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'Super Admin' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'Admin' ? 'bg-teal-100 text-teal-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleResetPassword(user.name)}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Reset Password"
                        >
                          <KeyRound size={18} />
                        </button>
                        <button 
                          className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleArchive(user.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Archive User"
                        >
                          <ArchiveIcon size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
}
