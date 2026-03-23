import React, { useMemo, useState } from 'react';
import { useAppContext } from '../AppContext';
import { BorrowRequestTicket, Item } from '../types';
import { AlertCircle, CheckCircle, Plus, Send, Trash2 } from 'lucide-react';

interface BorrowLineItem {
  itemId: string;
  quantity: number;
}

const createLineItem = (itemId = ''): BorrowLineItem => ({
  itemId,
  quantity: 1,
});

const getDefaultBorrowItemId = (inventoryItems: Pick<Item, 'id' | 'status'>[]) =>
  inventoryItems.find(item => item.status !== 'Disposed')?.id ?? inventoryItems[0]?.id ?? '';

const getNextRequestId = (tickets: BorrowRequestTicket[]) => {
  const nextNumber = tickets.reduce((max, ticket) => {
    const match = ticket.id.match(/^BRQ-(\d+)$/i);
    if (!match) return max;
    return Math.max(max, Number(match[1]));
  }, 0) + 1;

  return `BRQ-${String(nextNumber).padStart(3, '0')}`;
};

export default function RequestItem() {
  const { items, users, borrowRequestTickets, setBorrowRequestTickets } = useAppContext();
  const [employeeId, setEmployeeId] = useState('');
  const [email, setEmail] = useState('');
  const [lineItems, setLineItems] = useState<BorrowLineItem[]>([createLineItem(getDefaultBorrowItemId(items))]);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const availableItems = useMemo(
    () => items.filter(item => item.status !== 'Disposed'),
    [items]
  );

  const updateLine = (index: number, updates: Partial<BorrowLineItem>) => {
    setLineItems(prev =>
      prev.map((line, lineIndex) => (lineIndex === index ? { ...line, ...updates } : line))
    );
  };

  const addLine = () => {
    const usedIds = lineItems.map(line => line.itemId);
    const nextItemId = availableItems.find(item => !usedIds.includes(item.id))?.id ?? availableItems[0]?.id ?? '';
    setLineItems(prev => [...prev, createLineItem(nextItemId)]);
  };

  const removeLine = (index: number) => {
    setLineItems(prev => (prev.length === 1 ? prev : prev.filter((_, lineIndex) => lineIndex !== index)));
  };

  const resetForm = () => {
    setEmployeeId('');
    setEmail('');
    setLineItems([createLineItem(getDefaultBorrowItemId(items))]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!employeeId.trim() || !email.trim()) {
      setNotice({ type: 'error', text: 'Employee ID and email are required.' });
      return;
    }

    if (availableItems.length === 0) {
      setNotice({ type: 'error', text: 'No available inventory items to request right now.' });
      return;
    }

    for (const [index, line] of lineItems.entries()) {
      const selectedItem = items.find(item => item.id === line.itemId);

      if (!selectedItem) {
        setNotice({ type: 'error', text: `Select a valid item for row ${index + 1}.` });
        return;
      }

      if (selectedItem.status === 'Disposed') {
        setNotice({ type: 'error', text: `Disposed item selected on row ${index + 1}. Please choose another item.` });
        return;
      }

      if (!Number.isFinite(line.quantity) || line.quantity < 1) {
        setNotice({ type: 'error', text: `Quantity on row ${index + 1} must be at least 1.` });
        return;
      }
    }

    const normalizedEmployeeId = employeeId.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const matchedUser = users.find(user =>
      user.employeeNumber.toLowerCase() === normalizedEmployeeId.toLowerCase() ||
      user.email.toLowerCase() === normalizedEmail
    );
    const now = new Date().toISOString();
    const newRequest: BorrowRequestTicket = {
      id: getNextRequestId(borrowRequestTickets),
      employeeId: normalizedEmployeeId,
      employeeEmail: email.trim(),
      requestedBy: matchedUser?.name || normalizedEmployeeId || email.trim() || 'Unknown',
      items: lineItems.map(line => {
        const selectedItem = items.find(item => item.id === line.itemId)!;
        return {
          itemId: selectedItem.id,
          itemName: selectedItem.name,
          quantity: line.quantity,
        };
      }),
      status: 'Pending',
      createdAt: now,
    };

    setBorrowRequestTickets(prev => [newRequest, ...prev]);
    setNotice({
      type: 'success',
      text: `Request ${newRequest.id} logged for ${newRequest.requestedBy} with ${lineItems.length} item${lineItems.length === 1 ? '' : 's'}.`,
    });
    resetForm();
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Request Item Form</h2>
        <p className="text-slate-600">Submit a borrowing request with employee details and requested inventory items.</p>
      </div>

      {notice && (
        <div
          className={`mb-6 p-4 border rounded-xl flex items-center space-x-2 ${
            notice.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {notice.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{notice.text}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Employee ID</label>
              <input
                type="text"
                required
                value={employeeId}
                onChange={e => setEmployeeId(e.target.value)}
                placeholder="Enter employee ID"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Employee Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="employee@company.com"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700">Items to Borrow</h3>
              <button
                type="button"
                onClick={addLine}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <Plus size={16} />
                Add Item
              </button>
            </div>

            {lineItems.map((line, index) => (
              <div key={`${line.itemId || 'blank'}-${index}`} className="grid grid-cols-1 md:grid-cols-[1fr_140px_auto] gap-3 items-end p-3 border border-slate-100 rounded-xl bg-slate-50/60">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Item</label>
                  <select
                    value={line.itemId}
                    onChange={e => updateLine(index, { itemId: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    required
                  >
                    {availableItems.length === 0 ? (
                      <option value="">No available items</option>
                    ) : (
                      availableItems.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.id} - {item.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={line.quantity}
                    onChange={e => updateLine(index, { quantity: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    required
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeLine(index)}
                  disabled={lineItems.length === 1}
                  className="h-11 px-3 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Remove row"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="w-full md:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium shadow-sm"
            >
              <Send size={18} />
              <span>Submit Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
