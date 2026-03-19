import { Item, User, Transaction } from './types';

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
