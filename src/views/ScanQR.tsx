import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { ScanLine, Search } from 'lucide-react';

export default function ScanQR() {
  const { items, setItems } = useAppContext();
  const [inputId, setInputId] = useState('');
  const [scannedItem, setScannedItem] = useState<any>(null);
  const [action, setAction] = useState<'IN' | 'OUT'>('OUT');

  const handleSearch = () => {
    const item = items.find(i => i.id === inputId || i.qrCode === inputId);
    if (item) {
      setScannedItem(item);
    } else {
      alert('Item not found!');
      setScannedItem(null);
    }
  };

  const handleAction = () => {
    if (!scannedItem) return;
    
    const newStatus = action === 'IN' ? 'Available' : 'In Use';
    
    setItems(items.map(i => 
      i.id === scannedItem.id ? { ...i, status: newStatus } : i
    ));
    
    alert(`Item successfully marked as ${newStatus}`);
    setScannedItem(null);
    setInputId('');
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Scan QR / Barcode</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-64 h-64 border-4 border-dashed border-emerald-200 rounded-2xl flex flex-col items-center justify-center text-emerald-400 mb-6 relative overflow-hidden">
            <ScanLine size={64} className="mb-4" />
            <p className="font-medium">Camera View</p>
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 animate-[scan_2s_ease-in-out_infinite]"></div>
          </div>
          <p className="text-sm text-slate-500 text-center">Position the QR code within the frame to scan automatically.</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Manual Input</h3>
            <div className="flex space-x-2">
              <input 
                type="text" 
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter Item ID or QR..."
              />
              <button 
                onClick={handleSearch}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors"
              >
                <Search size={20} />
              </button>
            </div>
          </div>

          {scannedItem && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 border-l-4 border-l-emerald-500">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Item Details</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-500">Name:</span>
                  <span className="font-medium text-slate-800">{scannedItem.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-medium text-slate-800">{scannedItem.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Status:</span>
                  <span className={`font-medium ${
                    scannedItem.status === 'Available' ? 'text-emerald-600' : 'text-amber-600'
                  }`}>{scannedItem.status}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="action" 
                      checked={action === 'OUT'} 
                      onChange={() => setAction('OUT')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-slate-700 font-medium">Borrow (OUT)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="action" 
                      checked={action === 'IN'} 
                      onChange={() => setAction('IN')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-slate-700 font-medium">Return (IN)</span>
                  </label>
                </div>

                <button 
                  onClick={handleAction}
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
                >
                  Confirm Action
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
