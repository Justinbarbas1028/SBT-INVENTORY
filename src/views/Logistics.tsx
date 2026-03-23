import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import {
  LogisticsPriority,
  LogisticsRequest,
  LogisticsStatus,
  LogisticsType,
} from '../types';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle,
  Clock3,
  Filter,
  Package,
  Plus,
  Search,
  Truck,
  XCircle,
} from 'lucide-react';

const getLocalDateInput = () => {
  const date = new Date();
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().split('T')[0];
};

const typeDefaults: Record<LogisticsType, { origin: string; destination: string }> = {
  Inbound: { origin: 'Supplier Hub', destination: 'Main Warehouse' },
  Outbound: { origin: 'Main Warehouse', destination: 'Branch A' },
  Transfer: { origin: 'Main Warehouse', destination: 'Branch B' },
  Return: { origin: 'Branch A', destination: 'Main Warehouse' },
};

const statusStyles: Record<LogisticsStatus, string> = {
  Requested: 'bg-slate-100 text-slate-700',
  Approved: 'bg-sky-100 text-sky-700',
  Packed: 'bg-violet-100 text-violet-700',
  'In Transit': 'bg-amber-100 text-amber-700',
  Delivered: 'bg-emerald-100 text-emerald-700',
  Returned: 'bg-orange-100 text-orange-700',
  Cancelled: 'bg-rose-100 text-rose-700',
};

const priorityStyles: Record<LogisticsPriority, string> = {
  Low: 'bg-slate-100 text-slate-700',
  Medium: 'bg-indigo-100 text-indigo-700',
  High: 'bg-rose-100 text-rose-700',
};

const nextStatusLabel = (status: LogisticsStatus) => {
  switch (status) {
    case 'Requested':
      return 'Approve';
    case 'Approved':
      return 'Pack';
    case 'Packed':
      return 'Dispatch';
    case 'In Transit':
      return 'Confirm Delivery';
    default:
      return 'Done';
  }
};

const getNextStatus = (status: LogisticsStatus): LogisticsStatus | null => {
  switch (status) {
    case 'Requested':
      return 'Approved';
    case 'Approved':
      return 'Packed';
    case 'Packed':
      return 'In Transit';
    case 'In Transit':
      return 'Delivered';
    default:
      return null;
  }
};

export default function Logistics() {
  const { currentUser, items, logisticsRequests, setLogisticsRequests } = useAppContext();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | LogisticsStatus>('All');
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [form, setForm] = useState({
    type: 'Outbound' as LogisticsType,
    itemId: items[0]?.id ?? '',
    quantity: 1,
    origin: typeDefaults.Outbound.origin,
    destination: typeDefaults.Outbound.destination,
    priority: 'Medium' as LogisticsPriority,
    scheduledDate: getLocalDateInput(),
    handler: currentUser?.name ?? 'Logistics Desk',
    notes: '',
  });

  const selectedItem = items.find(item => item.id === form.itemId);

  const pendingCount = logisticsRequests.filter(r => r.status === 'Requested').length;
  const approvedCount = logisticsRequests.filter(r => r.status === 'Approved' || r.status === 'Packed').length;
  const inTransitCount = logisticsRequests.filter(r => r.status === 'In Transit').length;
  const completedCount = logisticsRequests.filter(r => r.status === 'Delivered' || r.status === 'Returned').length;
  const cancelledCount = logisticsRequests.filter(r => r.status === 'Cancelled').length;

  const filteredRequests = [...logisticsRequests]
    .filter(request => {
      const matchesSearch =
        request.id.toLowerCase().includes(search.toLowerCase()) ||
        request.itemId.toLowerCase().includes(search.toLowerCase()) ||
        request.itemName.toLowerCase().includes(search.toLowerCase()) ||
        request.origin.toLowerCase().includes(search.toLowerCase()) ||
        request.destination.toLowerCase().includes(search.toLowerCase()) ||
        request.handler.toLowerCase().includes(search.toLowerCase()) ||
        request.requestedBy.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || request.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const updateType = (type: LogisticsType) => {
    const defaults = typeDefaults[type];
    setForm(prev => ({
      ...prev,
      type,
      origin: defaults.origin,
      destination: defaults.destination,
    }));
  };

  const createRequest = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedItem) {
      setNotice({ type: 'error', text: 'Select an inventory item before creating a logistics request.' });
      return;
    }

    if (selectedItem.status === 'Disposed') {
      setNotice({ type: 'error', text: 'Disposed items cannot be used in logistics requests.' });
      return;
    }

    const nextNumber = String(logisticsRequests.length + 1).padStart(3, '0');
    const now = new Date().toISOString();

    const newRequest: LogisticsRequest = {
      id: `LGX-${nextNumber}`,
      type: form.type,
      itemId: form.itemId,
      itemName: selectedItem.name,
      quantity: form.quantity,
      origin: form.origin,
      destination: form.destination,
      requestedBy: currentUser?.name ?? 'Unknown',
      handler: form.handler,
      priority: form.priority,
      status: 'Requested',
      scheduledDate: form.scheduledDate,
      createdAt: now,
      updatedAt: now,
      notes: form.notes,
    };

    setLogisticsRequests(prev => [newRequest, ...prev]);
    setNotice({ type: 'success', text: `Logistics request ${newRequest.id} created.` });
    setForm({
      type: 'Outbound',
      itemId: items[0]?.id ?? '',
      quantity: 1,
      origin: typeDefaults.Outbound.origin,
      destination: typeDefaults.Outbound.destination,
      priority: 'Medium',
      scheduledDate: getLocalDateInput(),
      handler: currentUser?.name ?? 'Logistics Desk',
      notes: '',
    });
  };

  const advanceRequest = (request: LogisticsRequest) => {
    const nextStatus = getNextStatus(request.status);
    if (!nextStatus) return;

    setLogisticsRequests(prev =>
      prev.map(item =>
        item.id === request.id
          ? { ...item, status: nextStatus, updatedAt: new Date().toISOString() }
          : item
      )
    );

    setNotice({
      type: 'success',
      text: `${request.id} moved from ${request.status} to ${nextStatus}.`,
    });
  };

  const cancelRequest = (request: LogisticsRequest) => {
    if (request.status === 'Delivered' || request.status === 'Returned' || request.status === 'Cancelled') return;

    const confirmed = window.confirm(`Cancel logistics request ${request.id}?`);
    if (!confirmed) return;

    setLogisticsRequests(prev =>
      prev.map(item =>
        item.id === request.id
          ? { ...item, status: 'Cancelled', updatedAt: new Date().toISOString() }
          : item
      )
    );

    setNotice({ type: 'success', text: `${request.id} was cancelled.` });
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white shadow-xl">
        <div className="absolute -right-12 top-0 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -left-8 bottom-0 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-emerald-200">
                <Truck size={14} />
                Logistics
              </div>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
                Move items cleanly from request to delivery.
              </h2>
              <p className="mt-3 max-w-xl text-sm md:text-base text-slate-300">
                This page covers the logistics branch from the SFD: request creation, review, packing,
                transit, and final delivery or return.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full lg:w-auto lg:min-w-[30rem]">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-xs uppercase tracking-[0.2em]">Total</span>
                  <Package size={16} />
                </div>
                <p className="mt-3 text-3xl font-bold">{logisticsRequests.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-xs uppercase tracking-[0.2em]">Pending</span>
                  <Clock3 size={16} />
                </div>
                <p className="mt-3 text-3xl font-bold">{pendingCount}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-xs uppercase tracking-[0.2em]">Prepared</span>
                  <ArrowRight size={16} />
                </div>
                <p className="mt-3 text-3xl font-bold">{approvedCount}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-xs uppercase tracking-[0.2em]">Completed</span>
                  <BadgeCheck size={16} />
                </div>
                <p className="mt-3 text-3xl font-bold">{completedCount}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'Requested', value: pendingCount, icon: Clock3 },
              { label: 'Approved', value: logisticsRequests.filter(r => r.status === 'Approved').length, icon: ArrowRight },
              { label: 'Packed', value: logisticsRequests.filter(r => r.status === 'Packed').length, icon: Package },
              { label: 'In Transit', value: inTransitCount, icon: Truck },
              { label: 'Delivered / Returned', value: completedCount, icon: BadgeCheck },
            ].map(step => {
              const StepIcon = step.icon;
              return (
                <div key={step.label} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-xs uppercase tracking-[0.2em]">{step.label}</span>
                    <StepIcon size={15} />
                  </div>
                  <p className="mt-2 text-2xl font-semibold">{step.value}</p>
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Cancelled requests: {cancelledCount}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.35fr] gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Create Logistics Request</h3>
              <p className="text-sm text-slate-500">Request movement for outbound, inbound, transfer, or return items.</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              <Plus size={14} />
              New
            </span>
          </div>

          {notice && (
            <div
              className={`mb-5 rounded-xl border p-3 flex items-start gap-2 ${
                notice.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-rose-200 bg-rose-50 text-rose-700'
              }`}
            >
              {notice.type === 'success' ? <CheckCircle size={18} className="mt-0.5" /> : <XCircle size={18} className="mt-0.5" />}
              <span className="text-sm">{notice.text}</span>
            </div>
          )}

          <form onSubmit={createRequest} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                <select
                  value={form.type}
                  onChange={e => updateType(e.target.value as LogisticsType)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                >
                  <option value="Outbound">Outbound</option>
                  <option value="Inbound">Inbound</option>
                  <option value="Transfer">Transfer</option>
                  <option value="Return">Return</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Item</label>
                <select
                  value={form.itemId}
                  onChange={e => setForm(prev => ({ ...prev, itemId: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                  disabled={items.length === 0}
                >
                  {items.length === 0 ? (
                    <option value="">No inventory items available</option>
                  ) : (
                    items.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.id} - {item.name}
                      </option>
                    ))
                  )}
                </select>
                {selectedItem && (
                  <p className="mt-2 text-xs text-slate-500">
                    Selected item status: <span className="font-medium text-slate-700">{selectedItem.status}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
                <input
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={e => setForm(prev => ({ ...prev, quantity: Number(e.target.value) || 1 }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                <select
                  value={form.priority}
                  onChange={e => setForm(prev => ({ ...prev, priority: e.target.value as LogisticsPriority }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Origin</label>
                <input
                  type="text"
                  value={form.origin}
                  onChange={e => setForm(prev => ({ ...prev, origin: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Destination</label>
                <input
                  type="text"
                  value={form.destination}
                  onChange={e => setForm(prev => ({ ...prev, destination: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Scheduled Date</label>
                <input
                  type="date"
                  value={form.scheduledDate}
                  onChange={e => setForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Handler</label>
                <input
                  type="text"
                  value={form.handler}
                  onChange={e => setForm(prev => ({ ...prev, handler: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
              <textarea
                value={form.notes}
                onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add route notes, delivery instructions, or return remarks..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 h-28 resize-none"
              />
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Requested by <span className="font-medium text-slate-800">{currentUser?.name}</span>. This request starts at
              <span className={`ml-2 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles.Requested}`}>Requested</span>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium shadow-sm"
            >
              <Truck size={18} />
              <span>Create Logistics Request</span>
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center gap-3 lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search requests..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={18} className="text-slate-400 shrink-0" />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as 'All' | LogisticsStatus)}
                className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
              >
                <option value="All">All Statuses</option>
                <option value="Requested">Requested</option>
                <option value="Approved">Approved</option>
                <option value="Packed">Packed</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
                <option value="Returned">Returned</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                  <th className="p-4 font-medium">Request</th>
                  <th className="p-4 font-medium">Item</th>
                  <th className="p-4 font-medium">Route</th>
                  <th className="p-4 font-medium">Schedule</th>
                  <th className="p-4 font-medium">Priority</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map(request => {
                  const canAdvance = request.status === 'Requested' || request.status === 'Approved' || request.status === 'Packed' || request.status === 'In Transit';
                  const nextLabel = nextStatusLabel(request.status);

                  return (
                    <tr key={request.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-mono text-sm text-slate-600">{request.id}</span>
                          <span className="text-sm font-medium text-slate-800">{request.type}</span>
                          <span className="text-xs text-slate-500">Requested by {request.requestedBy}</span>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800">{request.itemName}</span>
                          <span className="text-sm text-slate-500 font-mono">{request.itemId} - Qty {request.quantity}</span>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-800">{request.origin}</span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <ArrowRight size={12} />
                            {request.destination}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-800">{new Date(request.scheduledDate).toLocaleDateString()}</span>
                          <span className="text-xs text-slate-500">{request.handler}</span>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${priorityStyles[request.priority]}`}>
                          {request.priority}
                        </span>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles[request.status]}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {canAdvance && (
                            <button
                              onClick={() => advanceRequest(request)}
                              className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
                            >
                              <BadgeCheck size={15} />
                              {nextLabel}
                            </button>
                          )}
                          {request.status !== 'Delivered' && request.status !== 'Returned' && request.status !== 'Cancelled' && (
                            <button
                              onClick={() => cancelRequest(request)}
                              className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-700 hover:bg-rose-100 transition-colors"
                            >
                              <XCircle size={15} />
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No logistics requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
