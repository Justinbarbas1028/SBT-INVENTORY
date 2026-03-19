import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { Truck, Plus, Download, Printer, Filter, Trash2, CheckSquare, XSquare, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Vehicle } from '../types';

export default function Logistics() {
  const { vehicles, setVehicles } = useAppContext();
  const [showAdd, setShowAdd] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ plateNumber: '', orCr: '', codingDay: 'Monday' });
  const [search, setSearch] = useState('');
  const [selectedVehicles, setSelectedVehicles] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<{ key: keyof Vehicle, direction: 'asc' | 'desc' } | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ type: 'delete' | 'status' | 'export', payload?: any } | null>(null);

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const v: Vehicle = {
      id: `VEH-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      ...newVehicle,
      status: 'Available'
    };
    setVehicles([...vehicles, v]);
    setShowAdd(false);
    setNewVehicle({ plateNumber: '', orCr: '', codingDay: 'Monday' });
  };

  const filteredVehicles = vehicles.filter(v => 
    v.plateNumber.toLowerCase().includes(search.toLowerCase()) || 
    v.id.toLowerCase().includes(search.toLowerCase())
  );

  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const requestSort = (key: keyof Vehicle) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key: keyof Vehicle) => {
    if (sortConfig?.key !== key) return <ArrowUpDown size={14} className="ml-1 opacity-40 group-hover:opacity-100 transition-opacity" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={14} className="ml-1 text-emerald-600" />
      : <ArrowDown size={14} className="ml-1 text-emerald-600" />;
  };

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedVehicles);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedVehicles(newSelection);
  };

  const toggleAll = () => {
    if (selectedVehicles.size === sortedVehicles.length && sortedVehicles.length > 0) {
      setSelectedVehicles(new Set());
    } else {
      setSelectedVehicles(new Set(sortedVehicles.map(v => v.id)));
    }
  };

  const handleBulkDelete = () => {
    setVehicles(prev => prev.filter(v => !selectedVehicles.has(v.id)));
    setSelectedVehicles(new Set());
  };

  const handleBulkStatusUpdate = (status: Vehicle['status']) => {
    setVehicles(prev => prev.map(v => 
      selectedVehicles.has(v.id) ? { ...v, status } : v
    ));
    setSelectedVehicles(new Set());
  };

  const handleExport = (vehiclesToExport: typeof vehicles) => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Plate Number,OR/CR,Coding Day,Status\n"
      + vehiclesToExport.map(v => `${v.id},${v.plateNumber},${v.orCr},${v.codingDay},${v.status}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vehicles_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkExport = () => {
    const vehiclesToExport = vehicles.filter(v => selectedVehicles.has(v.id));
    handleExport(vehiclesToExport);
    setSelectedVehicles(new Set());
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Logistics & Fleet</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => handleExport(sortedVehicles)}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Export All</span>
          </button>
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
          >
            <Plus size={18} />
            <span>Register Vehicle</span>
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8 max-w-2xl animate-in fade-in slide-in-from-top-2">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Register New Vehicle</h3>
          <form onSubmit={handleAddVehicle} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Plate Number</label>
              <input 
                required
                type="text" 
                value={newVehicle.plateNumber}
                onChange={e => setNewVehicle({...newVehicle, plateNumber: e.target.value})}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">OR/CR</label>
              <input 
                required
                type="text" 
                value={newVehicle.orCr}
                onChange={e => setNewVehicle({...newVehicle, orCr: e.target.value})}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Coding Day</label>
              <select 
                value={newVehicle.codingDay}
                onChange={e => setNewVehicle({...newVehicle, codingDay: e.target.value})}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2 pt-2">
              <button type="submit" className="w-full py-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">
                Save Vehicle
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedVehicles.size > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-2 text-emerald-800 font-medium">
            <CheckSquare size={20} />
            <span>{selectedVehicles.size} vehicles selected</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setConfirmAction({ type: 'status', payload: 'Available' })} className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-100 text-sm font-medium transition-colors">
              Mark Available
            </button>
            <button onClick={() => setConfirmAction({ type: 'status', payload: 'On Route' })} className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-100 text-sm font-medium transition-colors">
              Mark On Route
            </button>
            <button onClick={() => setConfirmAction({ type: 'status', payload: 'Maintenance' })} className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-100 text-sm font-medium transition-colors">
              Mark Maintenance
            </button>
            <div className="hidden sm:block w-px h-6 bg-emerald-200 mx-1"></div>
            <button onClick={() => setConfirmAction({ type: 'delete' })} className="flex items-center space-x-1 px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-100 text-sm font-medium transition-colors">
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
            <button onClick={() => setConfirmAction({ type: 'export' })} className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium transition-colors shadow-sm">
              <Download size={16} />
              <span>Export Selected</span>
            </button>
            <button onClick={() => setSelectedVehicles(new Set())} className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors ml-1" title="Clear selection">
              <XSquare size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <input 
            type="text" 
            placeholder="Search vehicles..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-64"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                <th className="p-4 w-12">
                  <input 
                    type="checkbox" 
                    checked={sortedVehicles.length > 0 && selectedVehicles.size === sortedVehicles.length}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </th>
                <th className="p-4 font-medium cursor-pointer group select-none hover:text-emerald-700 transition-colors" onClick={() => requestSort('id')}>
                  <div className="flex items-center">
                    Vehicle ID
                    {renderSortIcon('id')}
                  </div>
                </th>
                <th className="p-4 font-medium cursor-pointer group select-none hover:text-emerald-700 transition-colors" onClick={() => requestSort('plateNumber')}>
                  <div className="flex items-center">
                    Plate Number
                    {renderSortIcon('plateNumber')}
                  </div>
                </th>
                <th className="p-4 font-medium cursor-pointer group select-none hover:text-emerald-700 transition-colors" onClick={() => requestSort('orCr')}>
                  <div className="flex items-center">
                    OR/CR
                    {renderSortIcon('orCr')}
                  </div>
                </th>
                <th className="p-4 font-medium cursor-pointer group select-none hover:text-emerald-700 transition-colors" onClick={() => requestSort('codingDay')}>
                  <div className="flex items-center">
                    Coding Day
                    {renderSortIcon('codingDay')}
                  </div>
                </th>
                <th className="p-4 font-medium cursor-pointer group select-none hover:text-emerald-700 transition-colors" onClick={() => requestSort('status')}>
                  <div className="flex items-center">
                    Status
                    {renderSortIcon('status')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedVehicles.map(vehicle => (
                <tr key={vehicle.id} className={`border-b border-slate-50 transition-colors ${selectedVehicles.has(vehicle.id) ? 'bg-emerald-50/50' : 'hover:bg-slate-50/50'}`}>
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      checked={selectedVehicles.has(vehicle.id)}
                      onChange={() => toggleSelection(vehicle.id)}
                      className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                  </td>
                  <td className="p-4 font-mono text-sm text-slate-600 whitespace-nowrap">{vehicle.id}</td>
                  <td className="p-4 font-medium text-slate-800 whitespace-nowrap">{vehicle.plateNumber}</td>
                  <td className="p-4 text-slate-600 whitespace-nowrap">{vehicle.orCr}</td>
                  <td className="p-4 text-slate-600 whitespace-nowrap">{vehicle.codingDay}</td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      vehicle.status === 'Available' ? 'bg-emerald-100 text-emerald-700' :
                      vehicle.status === 'On Route' ? 'bg-teal-100 text-teal-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {vehicle.status}
                    </span>
                  </td>
                </tr>
              ))}
              {sortedVehicles.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">No vehicles found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {confirmAction && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {confirmAction.type === 'delete' && 'Delete Selected Vehicles'}
              {confirmAction.type === 'status' && `Mark as ${confirmAction.payload}`}
              {confirmAction.type === 'export' && 'Export Selected Vehicles'}
            </h3>
            <p className="text-slate-600 mb-6">
              {confirmAction.type === 'delete' && `Are you sure you want to delete ${selectedVehicles.size} selected vehicle(s)? This action cannot be undone.`}
              {confirmAction.type === 'status' && `Are you sure you want to change the status of ${selectedVehicles.size} selected vehicle(s) to "${confirmAction.payload}"?`}
              {confirmAction.type === 'export' && `Are you sure you want to export ${selectedVehicles.size} selected vehicle(s) to a CSV file?`}
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (confirmAction.type === 'delete') handleBulkDelete();
                  if (confirmAction.type === 'status') handleBulkStatusUpdate(confirmAction.payload);
                  if (confirmAction.type === 'export') handleBulkExport();
                  setConfirmAction(null);
                }}
                className={`px-4 py-2 text-white rounded-xl transition-colors font-medium ${
                  confirmAction.type === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

