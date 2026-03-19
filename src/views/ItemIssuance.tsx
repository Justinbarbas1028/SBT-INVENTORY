import React, { useState } from 'react';
import { useAppContext } from '../AppContext';

export default function ItemIssuance() {
  const { requests, setRequests, items, setItems, currentUser } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [deviceType, setDeviceType] = useState('Devices');

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq = {
      id: `REQ-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      employeeName: currentUser?.name || 'Unknown',
      deviceType,
      status: 'Pending' as const,
      dateRequested: new Date().toISOString().split('T')[0]
    };
    setRequests([...requests, newReq]);
    setShowForm(false);
    alert('Request submitted successfully!');
  };

  const handleIssue = (reqId: string) => {
    // Find an available item of the requested category
    const req = requests.find(r => r.id === reqId);
    if (!req) return;

    const availableItem = items.find(i => i.category === req.deviceType && i.status === 'Available');
    
    if (availableItem) {
      // Issue item
      setItems(items.map(i => i.id === availableItem.id ? { ...i, status: 'In Use' } : i));
      setRequests(requests.map(r => r.id === reqId ? { ...r, status: 'Approved' } : r));
      alert(`Item ${availableItem.name} issued successfully!`);
    } else {
      alert('No available items for this category.');
      setRequests(requests.map(r => r.id === reqId ? { ...r, status: 'Rejected' } : r));
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Item Issuance</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
        >
          {showForm ? 'View Requests' : 'Fill Request Form'}
        </button>
      </div>

      {showForm ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-slate-800 mb-6">New Item Request</h3>
          <form onSubmit={handleRequestSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Employee Name</label>
              <input 
                type="text" 
                value={currentUser?.name || ''}
                disabled
                className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Device/Item Type</label>
              <select 
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Office Supplies">Office Supplies</option>
                <option value="Devices">Devices</option>
                <option value="Furniture">Furniture</option>
                <option value="Construction tool">Construction tool</option>
              </select>
            </div>
            <button 
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
            >
              Submit Request
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                <th className="p-4 font-medium">Request ID</th>
                <th className="p-4 font-medium">Employee</th>
                <th className="p-4 font-medium">Requested Type</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-mono text-sm text-slate-600">{req.id}</td>
                  <td className="p-4 font-medium text-slate-800">{req.employeeName}</td>
                  <td className="p-4 text-slate-600">{req.deviceType}</td>
                  <td className="p-4 text-slate-500 text-sm">{req.dateRequested}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      req.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                      req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {req.status === 'Pending' && currentUser?.role !== 'Employee' && (
                      <button 
                        onClick={() => handleIssue(req.id)}
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-sm font-medium transition-colors"
                      >
                        Verify & Issue
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">No requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
