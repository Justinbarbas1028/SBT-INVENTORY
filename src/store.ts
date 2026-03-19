import { Item, User, Vehicle, ItemRequest } from './types';

export const initialItems: Item[] = [
  { id: 'ITM-001', name: 'Laptop ThinkPad', category: 'Devices', status: 'Available', qrCode: 'QR-001', dateAdded: '2023-10-01' },
  { id: 'ITM-002', name: 'Office Chair', category: 'Furniture', status: 'In Use', qrCode: 'QR-002', dateAdded: '2023-10-05' },
  { id: 'ITM-003', name: 'Hammer Drill', category: 'Construction tool', status: 'Faulty', qrCode: 'QR-003', dateAdded: '2023-11-12' },
];

export const initialUsers: User[] = [
  { id: 'USR-001', name: 'Alice Admin', email: 'alice@sbt.com', role: 'Super Admin', status: 'Active', employeeNumber: 'EMP-001' },
  { id: 'USR-002', name: 'Bob Staff', email: 'bob@sbt.com', role: 'Employee', status: 'Active', employeeNumber: 'EMP-002' },
];

export const initialVehicles: Vehicle[] = [
  { id: 'VEH-001', plateNumber: 'ABC-1234', orCr: 'ORCR-9988', codingDay: 'Monday', status: 'Available' },
  { id: 'VEH-002', plateNumber: 'XYZ-9876', orCr: 'ORCR-5544', codingDay: 'Wednesday', status: 'On Route' },
];

export const initialRequests: ItemRequest[] = [
  { id: 'REQ-001', employeeName: 'Bob Staff', deviceType: 'Devices', status: 'Pending', dateRequested: '2023-12-01' },
];
