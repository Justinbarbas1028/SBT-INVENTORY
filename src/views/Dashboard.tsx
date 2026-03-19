import React from 'react';
import { useAppContext } from '../AppContext';
import { Package, ArrowDownToLine, ArrowUpFromLine, History } from 'lucide-react';

export default function Dashboard() {
  const { items, transactions } = useAppContext();

  const totalItems = items.length;
  const itemsInStock = items.filter(i => i.status === 'In Stock').length;
  const itemsCheckedOut = items.filter(i => i.status === 'Checked Out').length;
  const totalTransactions = transactions.length;

  const stats = [
    { label: 'Total Items', value: totalItems, icon: Package, color: 'bg-slate-800' },
    { label: 'In Stock', value: itemsInStock, icon: ArrowDownToLine, color: 'bg-emerald-500' },
    { label: 'Checked Out', value: itemsCheckedOut, icon: ArrowUpFromLine, color: 'bg-amber-500' },
    { label: 'Total Transactions', value: totalTransactions, icon: History, color: 'bg-indigo-500' },
  ];

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
              <div className={`p-4 rounded-xl text-white ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {transactions.slice(0, 5).map(txn => (
              <div key={txn.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-medium text-slate-800">{txn.itemName}</p>
                  <p className="text-sm text-slate-500">{txn.person} • {new Date(txn.date).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                  txn.type === 'IN' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {txn.type === 'IN' ? <ArrowDownToLine size={12} /> : <ArrowUpFromLine size={12} />}
                  <span>{txn.type}</span>
                </span>
              </div>
            ))}
            {transactions.length === 0 && <p className="text-slate-500 text-sm">No recent transactions.</p>}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Inventory Status</h3>
          <div className="h-64 flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200 p-6">
            <div className="w-full max-w-xs space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">In Stock</span>
                  <span className="text-slate-500">{itemsInStock} / {totalItems}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${totalItems ? (itemsInStock / totalItems) * 100 : 0}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">Checked Out</span>
                  <span className="text-slate-500">{itemsCheckedOut} / {totalItems}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${totalItems ? (itemsCheckedOut / totalItems) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
