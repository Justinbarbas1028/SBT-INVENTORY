import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { Download, Search, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

export default function History() {
  const { transactions } = useAppContext();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'IN' | 'OUT'>('All');

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = 
      txn.itemId.toLowerCase().includes(search.toLowerCase()) ||
      txn.itemName.toLowerCase().includes(search.toLowerCase()) ||
      txn.person.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'All' || txn.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Transaction ID,Item ID,Item Name,Type,Date,Employee ID,Notes\n"
      + filteredTransactions.map(t => `${t.id},${t.itemId},${t.itemName},${t.type},${new Date(t.date).toLocaleString()},${t.person},${t.notes || ''}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transaction_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Transaction History</h2>
        <button 
          onClick={handleExport}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <Download size={18} />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
          >
            <option value="All">All Types</option>
            <option value="IN">Check In (IN)</option>
            <option value="OUT">Check Out (OUT)</option>
          </select>
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search history..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Item ID</th>
                <th className="p-4 font-medium">Item Name</th>
                <th className="p-4 font-medium">Employee ID</th>
                <th className="p-4 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(txn => (
                <tr key={txn.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      txn.type === 'IN' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {txn.type === 'IN' ? <ArrowDownToLine size={14} /> : <ArrowUpFromLine size={14} />}
                      <span>{txn.type}</span>
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600 whitespace-nowrap">
                    {new Date(txn.date).toLocaleString()}
                  </td>
                  <td className="p-4 font-mono text-sm text-slate-600 whitespace-nowrap">{txn.itemId}</td>
                  <td className="p-4 font-medium text-slate-800 whitespace-nowrap">{txn.itemName}</td>
                  <td className="p-4 font-mono text-slate-600 whitespace-nowrap">{txn.person}</td>
                  <td className="p-4 text-slate-500 text-sm max-w-xs truncate" title={txn.notes}>{txn.notes || '-'}</td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
