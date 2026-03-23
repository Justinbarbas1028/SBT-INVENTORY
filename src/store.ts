import { Item, User, Transaction, LogisticsRequest } from './types';

export const initialItems: Item[] = [
  { id: 'ITM-001', name: 'Laptop ThinkPad', category: 'Devices', status: 'In Stock', qrCode: 'QR-001', dateAdded: '2023-10-01' },
  { id: 'ITM-002', name: 'Office Chair', category: 'Furniture', status: 'Checked Out', assignedTo: 'Bob Staff', qrCode: 'QR-002', dateAdded: '2023-10-05' },
  { id: 'ITM-003', name: 'Hammer Drill', category: 'Tools', status: 'In Stock', qrCode: 'QR-003', dateAdded: '2023-11-12' },
];

export const initialUsers: User[] = [
  { id: 'USR-001', name: 'Alice Admin', email: 'alice@sbt.com', role: 'Super Admin', status: 'Active', employeeNumber: 'EMP-001' },
  { id: 'USR-002', name: 'Bob Staff', email: 'bob@sbt.com', role: 'Employee', status: 'Active', employeeNumber: 'EMP-002' },
];

export const initialTransactions: Transaction[] = [
  { id: 'TXN-001', itemId: 'ITM-001', itemName: 'Laptop ThinkPad', type: 'IN', date: '2023-10-01T09:00:00Z', person: 'Alice Admin', notes: 'Initial stock' },
  { id: 'TXN-002', itemId: 'ITM-002', itemName: 'Office Chair', type: 'IN', date: '2023-10-05T10:00:00Z', person: 'Alice Admin', notes: 'Initial stock' },
  { id: 'TXN-003', itemId: 'ITM-002', itemName: 'Office Chair', type: 'OUT', date: '2023-10-06T14:30:00Z', person: 'Bob Staff', notes: 'Assigned to Bob for new desk' },
];

export const initialLogisticsRequests: LogisticsRequest[] = [
  {
    id: 'LGX-001',
    type: 'Outbound',
    itemId: 'ITM-001',
    itemName: 'Laptop ThinkPad',
    quantity: 1,
    origin: 'Main Warehouse',
    destination: 'Branch A',
    requestedBy: 'Alice Admin',
    handler: 'North Dispatch',
    priority: 'High',
    status: 'In Transit',
    scheduledDate: '2026-03-24',
    createdAt: '2026-03-23T01:00:00Z',
    updatedAt: '2026-03-23T04:00:00Z',
    notes: 'Deliver before 4 PM',
  },
  {
    id: 'LGX-002',
    type: 'Inbound',
    itemId: 'ITM-002',
    itemName: 'Office Chair',
    quantity: 2,
    origin: 'Supplier Hub',
    destination: 'Main Warehouse',
    requestedBy: 'Bob Staff',
    handler: 'Receiving Team',
    priority: 'Medium',
    status: 'Requested',
    scheduledDate: '2026-03-25',
    createdAt: '2026-03-23T02:00:00Z',
    updatedAt: '2026-03-23T02:00:00Z',
    notes: 'Awaiting pickup confirmation',
  },
  {
    id: 'LGX-003',
    type: 'Transfer',
    itemId: 'ITM-003',
    itemName: 'Hammer Drill',
    quantity: 1,
    origin: 'Field Site',
    destination: 'Main Warehouse',
    requestedBy: 'Alice Admin',
    handler: 'City Fleet',
    priority: 'Low',
    status: 'Delivered',
    scheduledDate: '2026-03-20',
    createdAt: '2026-03-19T08:00:00Z',
    updatedAt: '2026-03-20T11:30:00Z',
    notes: 'Returned from site closeout',
  },
  {
    id: 'LGX-004',
    type: 'Return',
    itemId: 'ITM-002',
    itemName: 'Office Chair',
    quantity: 1,
    origin: 'Branch A',
    destination: 'Main Warehouse',
    requestedBy: 'Bob Staff',
    handler: 'City Fleet',
    priority: 'Medium',
    status: 'Returned',
    scheduledDate: '2026-03-22',
    createdAt: '2026-03-21T03:30:00Z',
    updatedAt: '2026-03-22T10:15:00Z',
    notes: 'Damaged item collected for inspection',
  },
];
