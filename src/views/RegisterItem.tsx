import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { Item, ItemCategory } from '../types';
import { AlertCircle, CheckCircle, PackagePlus, QrCode, Tag } from 'lucide-react';

const getNextItemId = (items: Item[]) => {
  const nextNumber = items.reduce((max, item) => {
    const match = item.id.match(/^ITM-(\d+)$/i);
    if (!match) return max;
    return Math.max(max, Number(match[1]));
  }, 0) + 1;

  return `ITM-${String(nextNumber).padStart(3, '0')}`;
};

export default function RegisterItem() {
  const { items, setItems, setTransactions, currentUser } = useAppContext();
  const [itemId, setItemId] = useState(() => getNextItemId(items));
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Other');
  const [notes, setNotes] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const inStockCount = items.filter(item => item.status === 'In Stock').length;
  const previewItemId = itemId.trim().toUpperCase() || getNextItemId(items);
  const previewQrCode = `QR-${previewItemId}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedItemId = itemId.trim().toUpperCase();
    const normalizedName = name.trim();
    const normalizedNotes = notes.trim();

    if (!normalizedItemId || !normalizedName) {
      setSuccessMessage('');
      setErrorMessage('Item ID and item name are required.');
      return;
    }

    if (items.some(item => item.id.toUpperCase() === normalizedItemId)) {
      setSuccessMessage('');
      setErrorMessage(`Item ${normalizedItemId} already exists in inventory.`);
      return;
    }

    const now = new Date().toISOString();
    const newItem: Item = {
      id: normalizedItemId,
      name: normalizedName,
      category,
      status: 'In Stock',
      qrCode: previewQrCode,
      dateAdded: now.split('T')[0],
      notes: normalizedNotes || undefined,
    };

    setItems(prev => [newItem, ...prev]);
    setTransactions(prev => [{
      id: `TXN-${Date.now()}`,
      itemId: normalizedItemId,
      itemName: normalizedName,
      type: 'IN',
      date: now,
      person: currentUser?.name || 'Unknown',
      notes: normalizedNotes ? `Registered item: ${normalizedNotes}` : 'Registered new item',
    }, ...prev]);

    setSuccessMessage(`Registered ${normalizedName} (${normalizedItemId}) as a new inventory item.`);
    setErrorMessage('');
    setItemId(getNextItemId([...items, newItem]));
    setName('');
    setCategory('Other');
    setNotes('');

    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white shadow-xl">
          <div className="absolute -right-12 top-0 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute -left-8 bottom-0 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative p-6 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-emerald-200">
                  <PackagePlus size={14} />
                  Register Item
                </div>
                <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
                  Create a new inventory record.
                </h2>
                <p className="mt-3 max-w-xl text-sm md:text-base text-slate-300">
                  Add a new asset to the system before it goes through check-in, check-out, or logistics.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto lg:min-w-[30rem]">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-xs uppercase tracking-[0.2em]">Total Items</span>
                    <PackagePlus size={16} />
                  </div>
                  <p className="mt-3 text-3xl font-bold">{items.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-xs uppercase tracking-[0.2em]">In Stock</span>
                    <CheckCircle size={16} />
                  </div>
                  <p className="mt-3 text-3xl font-bold">{inStockCount}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-xs uppercase tracking-[0.2em]">Next ID</span>
                    <Tag size={16} />
                  </div>
                  <p className="mt-3 text-2xl font-bold">{previewItemId}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800">New Item Details</h3>
            <p className="text-sm text-slate-500 mt-1">
              The item will be created with an initial status of In Stock.
            </p>

            {successMessage && (
              <div className="mt-5 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
                <CheckCircle size={20} />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="mt-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={20} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Item ID</label>
                  <input
                    type="text"
                    value={itemId}
                    onChange={e => {
                      setItemId(e.target.value.toUpperCase());
                      setErrorMessage('');
                    }}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-mono"
                    placeholder="ITM-004"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Auto-filled with the next available inventory number.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <select
                    value={category}
                    onChange={e => {
                      setCategory(e.target.value as ItemCategory);
                      setErrorMessage('');
                    }}
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Item Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="e.g., Laptop ThinkPad"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                />
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Generated QR Code</label>
                    <p className="text-xs text-slate-500 mt-1">This value is stored with the item and used by scanning flows.</p>
                  </div>
                  <QrCode size={18} className="text-slate-400 shrink-0" />
                </div>
                <div className="mt-3 rounded-xl border border-dashed border-slate-200 bg-white px-4 py-3">
                  <p className="font-mono text-sm text-slate-700">{previewQrCode}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={e => {
                    setNotes(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="Add item condition, supplier details, or other references..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 h-24 resize-none"
                />
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                Registered by <span className="font-medium text-slate-800">{currentUser?.name ?? 'Unknown'}</span>.
                The new item starts at <span className="font-medium text-emerald-700">In Stock</span> and is ready for use.
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium shadow-sm"
              >
                <PackagePlus size={18} />
                <span>Register Item</span>
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-slate-800">Preview</h3>
              <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Item</p>
                    <p className="mt-1 text-lg font-semibold text-slate-800">{name || 'New Item'}</p>
                    <p className="text-sm text-slate-500 font-mono">{previewItemId}</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                    In Stock
                  </span>
                </div>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-3">
                    <span className="text-slate-500">Category</span>
                    <span className="font-medium text-slate-800">{category}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-3">
                    <span className="text-slate-500">QR Code</span>
                    <span className="font-mono text-slate-800">{previewQrCode}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-3">
                    <span className="text-slate-500">Last Updated</span>
                    <span className="font-medium text-slate-800">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <QrCode size={18} className="text-emerald-600" />
                Registration Flow
              </div>
              <ol className="mt-4 space-y-3 text-sm text-slate-600">
                <li>1. Enter the item details and confirm the inventory number.</li>
                <li>2. Save the item to add it to stock and history.</li>
                <li>3. Use check in, check out, or logistics after it exists.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
