import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { Download, Printer, Filter, Archive, CheckSquare, XSquare, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { ItemStatus, Item } from '../types';

export default function Inventory() {
  const { items, setItems } = useAppContext();
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<{ key: keyof Item, direction: 'asc' | 'desc' } | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ type: 'archive' | 'status' | 'export', payload?: any } | null>(null);

  const activeItems = items.filter(i => i.status !== 'Archived');

  const filteredItems = activeItems.filter(item => {
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.id.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const requestSort = (key: keyof Item) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key: keyof Item) => {
    if (sortConfig?.key !== key) return <ArrowUpDown size={14} className="ml-1 opacity-40 group-hover:opacity-100 transition-opacity" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={14} className="ml-1 text-emerald-600" />
      : <ArrowDown size={14} className="ml-1 text-emerald-600" />;
  };

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedItems(newSelection);
  };

  const toggleAll = () => {
    if (selectedItems.size === sortedItems.length && sortedItems.length > 0) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(sortedItems.map(i => i.id)));
    }
  };

  const handleBulkArchive = () => {
    setItems(prev => prev.map(item => 
      selectedItems.has(item.id) ? { ...item, status: 'Archived' } : item
    ));
    setSelectedItems(new Set());
  };

  const handleBulkStatusUpdate = (status: ItemStatus) => {
    setItems(prev => prev.map(item => 
      selectedItems.has(item.id) ? { ...item, status } : item
    ));
    setSelectedItems(new Set());
  };

  const handleExport = (itemsToExport: typeof items) => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Name,Category,Status,Date Added\n"
      + itemsToExport.map(e => `${e.id},${e.name},${e.category},${e.status},${e.dateAdded}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkExport = () => {
    const itemsToExport = items.filter(i => selectedItems.has(i.id));
    handleExport(itemsToExport);
    setSelectedItems(new Set());
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Inventory Management</h2>
        <div className="flex space-x-3">
          <button 
            onClick={() => handleExport(sortedItems)}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Export All</span>
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors">
            <Printer size={18} />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {selectedItems.size > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-2 text-emerald-800 font-medium">
            <CheckSquare size={20} />
            <span>{selectedItems.size} items selected</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setConfirmAction({ type: 'status', payload: 'Available' })} className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-100 text-sm font-medium transition-colors">
              Mark Available
            </button>
            <button onClick={() => setConfirmAction({ type: 'status', payload: 'In Use' })} className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-100 text-sm font-medium transition-colors">
              Mark In Use
            </button>
            <button onClick={() => setConfirmAction({ type: 'status', payload: 'Faulty' })} className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-100 text-sm font-medium transition-colors">
              Mark Faulty
            </button>
            <div className="hidden sm:block w-px h-6 bg-emerald-200 mx-1"></div>
            <button onClick={() => setConfirmAction({ type: 'archive' })} className="flex items-center space-x-1 px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-100 text-sm font-medium transition-colors">
              <Archive size={16} />
              <span>Archive</span>
            </button>
            <button onClick={() => setConfirmAction({ type: 'export' })} className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium transition-colors shadow-sm">
              <Download size={16} />
              <span>Export Selected</span>
            </button>
            <button onClick={() => setSelectedItems(new Set())} className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors ml-1" title="Clear selection">
              <XSquare size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
            >
              <option value="All">All Categories</option>
              <option value="Office Supplies">Office Supplies</option>
              <option value="Devices">Devices</option>
              <option value="Furniture">Furniture</option>
              <option value="Construction tool">Construction tool</option>
            </select>
            <button className="p-2 text-slate-400 hover:text-emerald-600 border border-slate-200 rounded-xl bg-slate-50">
              <Filter size={20} />
            </button>
          </div>
          <input 
            type="text" 
            placeholder="Search inventory..." 
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
                    checked={sortedItems.length > 0 && selectedItems.size === sortedItems.length}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </th>
                <th className="p-4 font-medium cursor-pointer group select-none hover:text-emerald-700 transition-colors" onClick={() => requestSort('id')}>
                  <div className="flex items-center">
                    Item ID
                    {renderSortIcon('id')}
                  </div>
                </th>
                <th className="p-4 font-medium cursor-pointer group select-none hover:text-emerald-700 transition-colors" onClick={() => requestSort('name')}>
                  <div className="flex items-center">
                    Name
                    {renderSortIcon('name')}
                  </div>
                </th>
                <th className="p-4 font-medium cursor-pointer group select-none hover:text-emerald-700 transition-colors" onClick={() => requestSort('category')}>
                  <div className="flex items-center">
                    Category
                    {renderSortIcon('category')}
                  </div>
                </th>
                <th className="p-4 font-medium cursor-pointer group select-none hover:text-emerald-700 transition-colors" onClick={() => requestSort('status')}>
                  <div className="flex items-center">
                    Status
                    {renderSortIcon('status')}
                  </div>
                </th>
                <th className="p-4 font-medium cursor-pointer group select-none hover:text-emerald-700 transition-colors" onClick={() => requestSort('dateAdded')}>
                  <div className="flex items-center">
                    Date Added
                    {renderSortIcon('dateAdded')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map(item => (
                <tr key={item.id} className={`border-b border-slate-50 transition-colors ${selectedItems.has(item.id) ? 'bg-emerald-50/50' : 'hover:bg-slate-50/50'}`}>
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      checked={selectedItems.has(item.id)}
                      onChange={() => toggleSelection(item.id)}
                      className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                  </td>
                  <td className="p-4 font-mono text-sm text-slate-600 whitespace-nowrap">{item.id}</td>
                  <td className="p-4 font-medium text-slate-800 whitespace-nowrap">{item.name}</td>
                  <td className="p-4 text-slate-600 whitespace-nowrap">{item.category}</td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Available' ? 'bg-emerald-100 text-emerald-700' :
                      item.status === 'In Use' ? 'bg-teal-100 text-teal-700' :
                      item.status === 'Faulty' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 text-sm whitespace-nowrap">{item.dateAdded}</td>
                </tr>
              ))}
              {sortedItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">No items found.</td>
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
              {confirmAction.type === 'archive' && 'Archive Selected Items'}
              {confirmAction.type === 'status' && `Mark as ${confirmAction.payload}`}
              {confirmAction.type === 'export' && 'Export Selected Items'}
            </h3>
            <p className="text-slate-600 mb-6">
              {confirmAction.type === 'archive' && `Are you sure you want to archive ${selectedItems.size} selected item(s)? This action will hide them from the active inventory.`}
              {confirmAction.type === 'status' && `Are you sure you want to change the status of ${selectedItems.size} selected item(s) to "${confirmAction.payload}"?`}
              {confirmAction.type === 'export' && `Are you sure you want to export ${selectedItems.size} selected item(s) to a CSV file?`}
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
                  if (confirmAction.type === 'archive') handleBulkArchive();
                  if (confirmAction.type === 'status') handleBulkStatusUpdate(confirmAction.payload);
                  if (confirmAction.type === 'export') handleBulkExport();
                  setConfirmAction(null);
                }}
                className={`px-4 py-2 text-white rounded-xl transition-colors font-medium ${
                  confirmAction.type === 'archive' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
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
