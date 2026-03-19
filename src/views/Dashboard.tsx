import React from 'react';
import { useAppContext } from '../AppContext';
import { Package, Wrench, Truck, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const { items, vehicles, requests } = useAppContext();

  const totalItems = items.length;
  const itemsInUse = items.filter(i => i.status === 'In Use').length;
  const faultyItems = items.filter(i => i.status === 'Faulty').length;
  const availableVehicles = vehicles.filter(v => v.status === 'Available').length;

  const stats = [
    { label: 'Total Items', value: totalItems, icon: Package, color: 'bg-teal-500' },
    { label: 'Items In Use', value: itemsInUse, icon: CheckCircle, color: 'bg-emerald-500' },
    { label: 'Faulty Items', value: faultyItems, icon: Wrench, color: 'bg-red-500' },
    { label: 'Available Vehicles', value: availableVehicles, icon: Truck, color: 'bg-emerald-500' },
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
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Item Requests</h3>
          <div className="space-y-4">
            {requests.slice(0, 5).map(req => (
              <div key={req.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-medium text-slate-800">{req.employeeName}</p>
                  <p className="text-sm text-slate-500">Requested: {req.deviceType}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  req.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                  req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {req.status}
                </span>
              </div>
            ))}
            {requests.length === 0 && <p className="text-slate-500 text-sm">No recent requests.</p>}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">System Analytics</h3>
          <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-400">Analytics Chart Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
}
