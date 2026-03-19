import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { Truck, Plus } from 'lucide-react';

export default function Logistics() {
  const { vehicles, setVehicles } = useAppContext();
  const [showAdd, setShowAdd] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ plateNumber: '', orCr: '', codingDay: 'Monday' });

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const v = {
      id: `VEH-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      ...newVehicle,
      status: 'Available' as const
    };
    setVehicles([...vehicles, v]);
    setShowAdd(false);
    setNewVehicle({ plateNumber: '', orCr: '', codingDay: 'Monday' });
  };

  const handleDispatch = (id: string) => {
    setVehicles(vehicles.map(v => v.id === id ? { ...v, status: 'On Route' } : v));
  };

  const handleReturn = (id: string) => {
    setVehicles(vehicles.map(v => v.id === id ? { ...v, status: 'Available' } : v));
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Logistics & Fleet</h2>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
        >
          <Plus size={18} />
          <span>Register Vehicle</span>
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8 max-w-2xl">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map(vehicle => (
          <div key={vehicle.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 rounded-xl text-slate-600">
                <Truck size={24} />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                vehicle.status === 'Available' ? 'bg-emerald-100 text-emerald-700' :
                vehicle.status === 'On Route' ? 'bg-teal-100 text-teal-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                {vehicle.status}
              </span>
            </div>
            
            <div className="mb-6 flex-1">
              <h3 className="text-xl font-bold text-slate-800">{vehicle.plateNumber}</h3>
              <p className="text-sm text-slate-500 mt-1">ID: {vehicle.id}</p>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">OR/CR:</span>
                  <span className="font-medium text-slate-700">{vehicle.orCr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Coding Day:</span>
                  <span className="font-medium text-slate-700">{vehicle.codingDay}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              {vehicle.status === 'Available' ? (
                <button 
                  onClick={() => handleDispatch(vehicle.id)}
                  className="w-full py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl font-medium transition-colors"
                >
                  Dispatch Vehicle
                </button>
              ) : vehicle.status === 'On Route' ? (
                <button 
                  onClick={() => handleReturn(vehicle.id)}
                  className="w-full py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl font-medium transition-colors"
                >
                  Return Vehicle
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
