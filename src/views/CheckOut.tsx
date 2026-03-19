import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { PackageMinus, Search, CheckCircle, AlertCircle, QrCode } from 'lucide-react';
import QRScannerModal from '../components/QRScannerModal';

export default function CheckOut() {
  const { items, setItems, transactions, setTransactions, currentUser } = useAppContext();
  const [itemId, setItemId] = useState('');
  const [name, setName] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [notes, setNotes] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isScanningItem, setIsScanningItem] = useState(false);

  const handleCheckOut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemId || !assignedTo) return;

    const existingItem = items.find(i => i.id === itemId);
    
    if (!existingItem) {
      setErrorMessage('Item ID not found in inventory.');
      return;
    }

    if (existingItem.status === 'Checked Out') {
      setErrorMessage('Item is already checked out.');
      return;
    }

    if (existingItem.status === 'Disposed') {
      setErrorMessage('Item is disposed and cannot be checked out.');
      return;
    }

    const date = new Date().toISOString();

    // Update existing item
    setItems(prev => prev.map(i => 
      i.id === itemId ? { ...i, status: 'Checked Out', assignedTo } : i
    ));

    // Record transaction
    setTransactions(prev => [{
      id: `TXN-${Date.now()}`,
      itemId,
      itemName: existingItem.name,
      type: 'OUT',
      date,
      person: assignedTo,
      notes
    }, ...prev]);

    setSuccessMessage(`Successfully checked out ${existingItem.name} to ${assignedTo}`);
    setItemId('');
    setName('');
    setAssignedTo('');
    setNotes('');
    setErrorMessage('');
    
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.value;
    updateItemDetails(id);
  };

  const updateItemDetails = (id: string) => {
    setItemId(id);
    setErrorMessage('');
    const existingItem = items.find(i => i.id === id);
    if (existingItem) {
      setName(existingItem.name);
    } else {
      setName('');
    }
  };

  const handleScanItem = (decodedText: string) => {
    updateItemDetails(decodedText);
    setIsScanningItem(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Check Out Item</h2>
        <p className="text-slate-600">Assign an item from stock to a person or location.</p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={20} />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <form onSubmit={handleCheckOut} className="space-y-6">
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
                onClick={() => setIsScanningItem(true)}
                className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center border border-slate-200"
                title="Scan QR Code"
              >
                <QrCode size={20} />
              </button>
            </div>
            {name && <p className="text-sm font-medium text-emerald-600 mt-2">Found: {name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Employee ID</label>
            <input 
              type="text" 
              required
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="Enter Employee ID"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Notes (Optional)</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any relevant notes about the checkout purpose..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 h-24 resize-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button 
              type="submit"
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium shadow-sm"
            >
              <PackageMinus size={20} />
              <span>Check Out Item</span>
            </button>
          </div>
        </form>
      </div>

      {isScanningItem && (
        <QRScannerModal 
          onScan={handleScanItem} 
          onClose={() => setIsScanningItem(false)} 
        />
      )}
    </div>
  );
}
