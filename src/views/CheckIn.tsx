import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { PackagePlus, Search, CheckCircle, QrCode } from 'lucide-react';
import { ItemCategory } from '../types';
import QRScannerModal from '../components/QRScannerModal';

export default function CheckIn() {
  const { items, setItems, transactions, setTransactions, currentUser } = useAppContext();
  const [itemId, setItemId] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Other');
  const [notes, setNotes] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemId || !name) return;

    const existingItem = items.find(i => i.id === itemId);
    const date = new Date().toISOString();

    if (existingItem) {
      // Update existing item
      setItems(prev => prev.map(i => 
        i.id === itemId ? { ...i, status: 'In Stock', assignedTo: undefined, name, category } : i
      ));
    } else {
      // Create new item
      setItems(prev => [...prev, {
        id: itemId,
        name,
        category,
        status: 'In Stock',
        qrCode: `QR-${itemId}`,
        dateAdded: new Date().toISOString().split('T')[0]
      }]);
    }

    // Record transaction
    setTransactions(prev => [{
      id: `TXN-${Date.now()}`,
      itemId,
      itemName: name,
      type: 'IN',
      date,
      person: currentUser?.name || 'Unknown',
      notes
    }, ...prev]);

    setSuccessMessage(`Successfully checked in ${name} (${itemId})`);
    setItemId('');
    setName('');
    setCategory('Other');
    setNotes('');
    
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.value;
    updateItemDetails(id);
  };

  const updateItemDetails = (id: string) => {
    setItemId(id);
    const existingItem = items.find(i => i.id === id);
    if (existingItem) {
      setName(existingItem.name);
      setCategory(existingItem.category);
    }
  };

  const handleScan = (decodedText: string) => {
    updateItemDetails(decodedText);
    setIsScanning(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Check In Item</h2>
        <p className="text-slate-600">Register a new item or return an existing item to stock.</p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <form onSubmit={handleCheckIn} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Item ID</label>
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  required
                  value={itemId}
                  onChange={handleIdChange}
                  placeholder="Enter or scan Item ID"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                />
                <Search className="absolute left-3 top-3.5 text-slate-400" size={20} />
              </div>
              <button
                type="button"
                onClick={() => setIsScanning(true)}
                className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center border border-slate-200"
                title="Scan QR Code"
              >
                <QrCode size={20} />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">If the ID exists, details will auto-fill.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Item Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Laptop ThinkPad"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
              >
                <option value="Office Supplies">Office Supplies</option>
                <option value="Devices">Devices</option>
                <option value="Furniture">Furniture</option>
                <option value="Tools">Tools</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Notes (Optional)</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any relevant notes about the item's condition or source..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 h-24 resize-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button 
              type="submit"
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium shadow-sm"
            >
              <PackagePlus size={20} />
              <span>Check In Item</span>
            </button>
          </div>
        </form>
      </div>

      {isScanning && (
        <QRScannerModal 
          onScan={handleScan} 
          onClose={() => setIsScanning(false)} 
        />
      )}
    </div>
  );
}
