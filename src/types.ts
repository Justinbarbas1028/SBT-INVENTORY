export type Role = 'Super Admin' | 'Admin' | 'Employee';

export type ItemCategory = 'Office Supplies' | 'Devices' | 'Furniture' | 'Tools' | 'Other';
export type ItemStatus = 'In Stock' | 'Checked Out' | 'Disposed';

export interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  status: ItemStatus;
  qrCode: string;
  dateAdded: string;
  assignedTo?: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'Active' | 'Archived';
  employeeNumber: string;
}

export type TransactionType = 'IN' | 'OUT';

export interface Transaction {
  id: string;
  itemId: string;
  itemName: string;
  type: TransactionType;
  date: string;
  person: string;
  notes: string;
}

export type LogisticsType = 'Inbound' | 'Outbound' | 'Transfer' | 'Return';
export type LogisticsPriority = 'Low' | 'Medium' | 'High';
export type LogisticsStatus = 'Requested' | 'Approved' | 'Packed' | 'In Transit' | 'Delivered' | 'Returned' | 'Cancelled';

export interface LogisticsRequest {
  id: string;
  type: LogisticsType;
  itemId: string;
  itemName: string;
  quantity: number;
  origin: string;
  destination: string;
  requestedBy: string;
  handler: string;
  priority: LogisticsPriority;
  status: LogisticsStatus;
  scheduledDate: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}
