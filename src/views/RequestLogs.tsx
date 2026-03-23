import React, { useMemo, useState } from 'react';
import { useAppContext } from '../AppContext';
import { BorrowRequestStatus, BorrowRequestTicket } from '../types';
import { BadgeCheck, Clock3, FileText, Filter, Search, XCircle } from 'lucide-react';

const statusStyles: Record<BorrowRequestStatus, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Approved: 'bg-emerald-100 text-emerald-700',
  Denied: 'bg-rose-100 text-rose-700',
};

export default function RequestLogs() {
  const { borrowRequestTickets, currentUser, setBorrowRequestTickets } = useAppContext();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | BorrowRequestStatus>('All');
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const searchValue = search.trim().toLowerCase();

  const reviewRequest = (ticket: BorrowRequestTicket, decision: 'Approved' | 'Denied') => {
    if (ticket.status !== 'Pending') {
      setNotice({ type: 'error', text: `${ticket.id} has already been reviewed.` });
      return;
    }

    const actionVerb = decision === 'Approved' ? 'approve' : 'reject';
    const confirmed = window.confirm(`Are you sure you want to ${actionVerb} ${ticket.id}?`);
    if (!confirmed) return;

    const note =
      window.prompt(
        decision === 'Approved'
          ? `Optional approval note for ${ticket.id}:`
          : `Optional rejection note for ${ticket.id}:`
      )?.trim() || undefined;

    const now = new Date().toISOString();

    setBorrowRequestTickets(prev =>
      prev.map(item =>
        item.id === ticket.id
          ? {
              ...item,
              status: decision,
              reviewedAt: now,
              reviewedBy: currentUser?.name ?? 'Super Admin',
              reviewNote: note,
            }
          : item
      )
    );

    setNotice({
      type: 'success',
      text: `${ticket.id} was ${decision.toLowerCase()} successfully.`,
    });
  };

  const filteredTickets = useMemo(() => {
    return [...borrowRequestTickets]
      .filter(ticket => {
        const matchesSearch =
          ticket.id.toLowerCase().includes(searchValue) ||
          ticket.employeeId.toLowerCase().includes(searchValue) ||
          ticket.employeeEmail.toLowerCase().includes(searchValue) ||
          ticket.requestedBy.toLowerCase().includes(searchValue) ||
          ticket.items.some(item =>
            item.itemId.toLowerCase().includes(searchValue) ||
            item.itemName.toLowerCase().includes(searchValue)
          );

        const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [borrowRequestTickets, searchValue, statusFilter]);

  const pendingCount = borrowRequestTickets.filter(ticket => ticket.status === 'Pending').length;
  const approvedCount = borrowRequestTickets.filter(ticket => ticket.status === 'Approved').length;
  const deniedCount = borrowRequestTickets.filter(ticket => ticket.status === 'Denied').length;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white shadow-xl">
        <div className="absolute -right-12 top-0 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -left-8 bottom-0 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-emerald-200">
                <FileText size={14} />
                Request Logs
              </div>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
                Track employee item requests in one place.
              </h2>
              <p className="mt-3 max-w-xl text-sm md:text-base text-slate-300">
                Super Admin can review every submitted borrow request, approve or reject it, filter by status,
                and inspect the employee and item details behind each log entry.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full lg:w-auto lg:min-w-[30rem]">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-xs uppercase tracking-[0.2em]">Total</span>
                  <FileText size={16} />
                </div>
                <p className="mt-3 text-3xl font-bold">{borrowRequestTickets.length}</p>
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
                  <span className="text-xs uppercase tracking-[0.2em]">Approved</span>
                  <BadgeCheck size={16} />
                </div>
                <p className="mt-3 text-3xl font-bold">{approvedCount}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-xs uppercase tracking-[0.2em]">Denied</span>
                  <XCircle size={16} />
                </div>
                <p className="mt-3 text-3xl font-bold">{deniedCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {notice && (
        <div
          className={`rounded-2xl border p-4 flex items-center gap-2 ${
            notice.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-rose-200 bg-rose-50 text-rose-700'
          }`}
        >
          {notice.type === 'success' ? <BadgeCheck size={18} /> : <XCircle size={18} />}
          <span className="text-sm">{notice.text}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center gap-3 lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search request logs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as 'All' | BorrowRequestStatus)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Denied">Denied</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                <th className="p-4 font-medium">Request</th>
                <th className="p-4 font-medium">Employee</th>
                <th className="p-4 font-medium">Items</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Created</th>
                <th className="p-4 font-medium">Review / Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map(ticket => (
                <tr key={ticket.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 align-top whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-sm text-slate-600">{ticket.id}</span>
                      <span className="text-xs text-slate-500">
                        {ticket.items.length} item{ticket.items.length === 1 ? '' : 's'} requested
                      </span>
                    </div>
                  </td>
                  <td className="p-4 align-top whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-slate-800">{ticket.requestedBy}</span>
                      <span className="text-sm text-slate-500 font-mono">{ticket.employeeId}</span>
                      <span className="text-xs text-slate-500">{ticket.employeeEmail}</span>
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <div className="flex flex-wrap gap-2">
                      {ticket.items.map((item, index) => (
                        <div key={`${ticket.id}-${item.itemId}-${index}`} className="rounded-xl bg-slate-50 px-3 py-2">
                          <p className="font-medium text-slate-800">{item.itemName}</p>
                          <p className="text-xs text-slate-500 font-mono">
                            {item.itemId} x {item.quantity}
                          </p>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 align-top whitespace-nowrap">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles[ticket.status]}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-4 align-top whitespace-nowrap text-sm text-slate-600">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4 align-top whitespace-nowrap text-sm text-slate-500">
                    {ticket.reviewedBy ? (
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-slate-700">{ticket.reviewedBy}</span>
                        <span>{ticket.reviewedAt ? new Date(ticket.reviewedAt).toLocaleString() : '-'}</span>
                        {ticket.reviewNote && <span className="max-w-xs truncate" title={ticket.reviewNote}>{ticket.reviewNote}</span>}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Pending review</span>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => reviewRequest(ticket, 'Approved')}
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
                          >
                            <BadgeCheck size={14} />
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => reviewRequest(ticket, 'Denied')}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100 transition-colors"
                          >
                            <XCircle size={14} />
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No request logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
