import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { ItemCategory } from '../types';
import { QrCode, Save } from 'lucide-react';

export default function RegisterItem() {
  const { items, setItems } = useAppContext();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Office Supplies');
  const [generatedId, setGeneratedId] = useState('');
  const [generatedQR, setGeneratedQR] = useState('');

  const handleGenerate = () => {
    if (!name) return alert('Please enter an item name');
    const newId = `ITM-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    setGeneratedId(newId);
    setGeneratedQR(`QR-${newId}`);
  };

  const handleSave = () => {
    if (!generatedId) return alert('Please generate ID and QR first');
    
    const newItem = {
      id: generatedId,
      name,
      category,
      status: 'Available' as const,
      qrCode: generatedQR,
      dateAdded: new Date().toISOString().split('T')[0]
    };

    setItems([...items, newItem]);
    alert('Item registered successfully!');
    setName('');
    setGeneratedId('');
    setGeneratedQR('');
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Register New Item</h2>
      
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Item Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Enter item name..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value as ItemCategory)}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="Office Supplies">Office Supplies</option>
            <option value="Devices">Devices</option>
            <option value="Furniture">Furniture</option>
            <option value="Construction tool">Construction tool</option>
          </select>
        </div>

        <div className="pt-4 flex items-center space-x-4">
          <button 
            onClick={handleGenerate}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors"
          >
            <QrCode size={18} />
            <span>Generate ID & QR</span>
          </button>
        </div>

        {generatedId && (
          <div className="p-4 sm:p-6 bg-slate-50 rounded-xl border border-slate-200 mt-6 flex flex-col sm:flex-row items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <p className="text-sm text-slate-500 mb-1">Generated Item ID</p>
              <p className="text-xl font-mono font-bold text-slate-800">{generatedId}</p>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-white border border-slate-200 rounded-lg flex items-center justify-center mb-2">
                <QrCode size={48} className="text-slate-800" />
              </div>
              <p className="text-xs font-mono text-slate-500">{generatedQR}</p>
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-slate-100">
          <button 
            onClick={handleSave}
            disabled={!generatedId}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            <span className="font-medium">Save Item</span>
          </button>
        </div>
      </div>
    </div>
  );
}
