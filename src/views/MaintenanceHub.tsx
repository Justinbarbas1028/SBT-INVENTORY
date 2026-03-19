import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { Wrench, Trash2, CheckCircle } from 'lucide-react';

export default function MaintenanceHub() {
  const { items, setItems } = useAppContext();
  const [inputId, setInputId] = useState('');

  const faultyItems = items.filter(i => i.status === 'Faulty');

  const handleMarkRepaired = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, status: 'Available' } : i));
  };

  const handleMarkDisposal = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, status: 'Disposed' } : i));
  };

  const handleManualScan = () => {
    const item = items.find(i => i.id === inputId);
    if (item) {
      setItems(items.map(i => i.id === inputId ? { ...i, status: 'Faulty' } : i));
      setInputId('');
    } else {
      alert('Item not found');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Maintenance Hub</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center">
              <Wrench className="mr-2 text-slate-400" size={20} />
              Faulty Items Queue
            </h3>
          </div>
          <div className="p-0">
            {faultyItems.length > 0 ? (
              <ul className="divide-y divide-slate-100">
                {faultyItems.map(item => (
                  <li key={item.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="font-medium text-slate-800">{item.name}</p>
                      <p className="text-sm text-slate-500 font-mono mt-1">{item.id} • {item.category}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleMarkRepaired(item.id)}
                        className="flex items-center space-x-1 px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-sm font-medium transition-colors"
                      >
                        <CheckCircle size={16} />
                        <span>Repaired</span>
                      </button>
                      <button 
                        onClick={() => handleMarkDisposal(item.id)}
                        className="flex items-center space-x-1 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl text-sm font-medium transition-colors"
                      >
                        <Trash2 size={16} />
                        <span>Dispose</span>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-12 text-center text-slate-500">
                <Wrench size={48} className="mx-auto mb-4 text-slate-300 opacity-50" />
                <p>No faulty items reported.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-fit">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Report Faulty Item</h3>
          <p className="text-sm text-slate-500 mb-4">Input item ID manually to mark it as faulty.</p>
          <div className="space-y-4">
            <input 
              type="text" 
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              placeholder="Enter Item ID..."
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button 
              onClick={handleManualScan}
              className="w-full py-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium"
            >
              Mark as Faulty
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
