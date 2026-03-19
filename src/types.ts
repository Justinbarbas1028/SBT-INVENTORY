export type Role = 'Super Admin' | 'Admin' | 'Employee';

export type ItemCategory = 'Office Supplies' | 'Devices' | 'Furniture' | 'Construction tool';
export type ItemStatus = 'Available' | 'In Use' | 'Faulty' | 'Disposed' | 'Archived';

export interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  status: ItemStatus;
  qrCode: string;
  dateAdded: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'Active' | 'Archived';
  employeeNumber: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  orCr: string;
  codingDay: string;
  status: 'Available' | 'On Route' | 'Maintenance';
}

export interface ItemRequest {
  id: string;
  employeeName: string;
  deviceType: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  dateRequested: string;
}
