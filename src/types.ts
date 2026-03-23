export type Role = 'Super Admin' | 'Admin' | 'Employee';
export type AppView =
  | 'dashboard'
  | 'inventory'
  | 'check-in'
  | 'check-out'
  | 'register-item'
  | 'logistics'
  | 'history'
  | 'manage-roles'
  | 'request-item';

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

export interface LogisticsRequestItem {
  itemId: string;
  itemName: string;
  quantity: number;
}

export interface LogisticsRequest {
  id: string;
  type: LogisticsType;
  items: LogisticsRequestItem[];
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

export type BorrowRequestStatus = 'Pending' | 'Approved' | 'Denied';

export interface BorrowRequestItem {
  itemId: string;
  itemName: string;
  quantity: number;
}

export interface BorrowRequestTicket {
  id: string;
  employeeId: string;
  employeeEmail: string;
  requestedBy: string;
  items: BorrowRequestItem[];
  status: BorrowRequestStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNote?: string;
}
