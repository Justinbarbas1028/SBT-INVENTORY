import React, { useMemo, useState } from 'react';
import { useAppContext } from '../AppContext';
import { AlertCircle, CheckCircle, ClipboardCheck, Plus, Send, ShieldCheck, ShieldX, Trash2 } from 'lucide-react';
import { BorrowRequestStatus } from '../types';

interface BorrowLineItem {
  itemId: string;
  quantity: number;
}

const createLineItem = (itemId = ''): BorrowLineItem => ({
  itemId,
  quantity: 1,
});

const statusBadgeStyles: Record<BorrowRequestStatus, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Approved: 'bg-emerald-100 text-emerald-700',
  Denied: 'bg-rose-100 text-rose-700',
};

export default function RequestItem() {
  const { items, currentUser, borrowRequestTickets, setBorrowRequestTickets } = useAppContext();
  const [employeeId, setEmployeeId] = useState('');
  const [email, setEmail] = useState('');
  const [lineItems, setLineItems] = useState<BorrowLineItem[]>([createLineItem(items[0]?.id ?? '')]);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const availableItems = useMemo(
    () => items.filter(item => item.status !== 'Disposed'),
    [items]
  );

  const ticketsForView = useMemo(() => {
    if (currentUser?.role === 'Super Admin') {
      return [...borrowRequestTickets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return borrowRequestTickets.filter(ticket => ticket.requestedBy === currentUser?.name);
  }, [borrowRequestTickets, currentUser?.name, currentUser?.role]);

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
    setLineItems([createLineItem(availableItems[0]?.id ?? '')]);
  };

  const reviewTicket = (ticketId: string, status: Exclude<BorrowRequestStatus, 'Pending'>) => {
    if (currentUser?.role !== 'Super Admin') return;

    setBorrowRequestTickets(prev =>
      prev.map(ticket =>
        ticket.id === ticketId && ticket.status === 'Pending'
          ? {
              ...ticket,
              status,
              reviewedAt: new Date().toISOString(),
              reviewedBy: currentUser.name,
            }
          : ticket
      )
    );

    setNotice({
      type: 'success',
      text: `Ticket ${ticketId} marked as ${status}.`,
    });
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

    const normalizedEmail = email.trim().toLowerCase();

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

    const requestItems = lineItems.map(line => {
      const selectedItem = items.find(item => item.id === line.itemId)!;

      return {
        itemId: selectedItem.id,
        itemName: selectedItem.name,
        quantity: line.quantity,
      };
    });

    const nextNumber = String(borrowRequestTickets.length + 1).padStart(3, '0');

    setBorrowRequestTickets(prev => [
      {
        id: `BRQ-${nextNumber}`,
        employeeId: employeeId.trim(),
        employeeEmail: normalizedEmail,
        requestedBy: currentUser?.name ?? 'Unknown',
        items: requestItems,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    setNotice({
      type: 'success',
      text: `Request submitted for ${employeeId.trim()} with ${lineItems.length} item${lineItems.length === 1 ? '' : 's'}.`,
    });
    resetForm();
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Request Item Form</h2>
        <p className="text-slate-600">Submit a borrowing request with employee details and requested inventory items.</p>
      </div>

      {notice && (
        <div
          className={`p-4 border rounded-xl flex items-center space-x-2 ${
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
              <div key={`${line.itemId}-${index}`} className="grid grid-cols-1 md:grid-cols-[1fr_140px_auto] gap-3 items-end p-3 border border-slate-100 rounded-xl bg-slate-50/60">
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
                          {item.id} — {item.name}
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

      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Request Ticket Logs</h3>
            <p className="text-sm text-slate-600">
              {currentUser?.role === 'Super Admin'
                ? 'Review pending borrowing requests and approve or deny tickets.'
                : 'Track the status of your borrowing request tickets.'}
            </p>
          </div>
          <ClipboardCheck className="text-slate-400" size={20} />
        </div>

        {ticketsForView.length === 0 ? (
          <p className="text-sm text-slate-500">No request tickets available.</p>
        ) : (
          <div className="space-y-3">
            {ticketsForView.map(ticket => (
              <article key={ticket.id} className="rounded-xl border border-slate-200 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-800">{ticket.id}</p>
                    <p className="text-sm text-slate-600">
                      {ticket.employeeId} • {ticket.employeeEmail}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusBadgeStyles[ticket.status]}`}>
                    {ticket.status}
                  </span>
                </div>

                <div className="text-sm text-slate-600 space-y-1">
                  <p>Requested by: {ticket.requestedBy}</p>
                  <p>Created: {new Date(ticket.createdAt).toLocaleString()}</p>
                  {ticket.reviewedBy && ticket.reviewedAt && (
                    <p>Reviewed by {ticket.reviewedBy} on {new Date(ticket.reviewedAt).toLocaleString()}</p>
                  )}
                </div>

                <ul className="text-sm text-slate-700 list-disc pl-5 space-y-1">
                  {ticket.items.map((item, index) => (
                    <li key={`${ticket.id}-${item.itemId}-${index}`}>{item.itemId} — {item.itemName} (Qty: {item.quantity})</li>
                  ))}
                </ul>

                {currentUser?.role === 'Super Admin' && ticket.status === 'Pending' && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => reviewTicket(ticket.id, 'Approved')}
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      <ShieldCheck size={16} />
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => reviewTicket(ticket.id, 'Denied')}
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                    >
                      <ShieldX size={16} />
                      Deny
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
