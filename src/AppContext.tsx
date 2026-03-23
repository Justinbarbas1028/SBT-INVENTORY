import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Item, User, Transaction, Role, LogisticsRequest } from './types';
import { initialItems, initialUsers, initialTransactions, initialLogisticsRequests } from './store';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  logisticsRequests: LogisticsRequest[];
  setLogisticsRequests: React.Dispatch<React.SetStateAction<LogisticsRequest[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(users[0]); // Default to Super Admin
  const [items, setItems] = useState<Item[]>(initialItems);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [logisticsRequests, setLogisticsRequests] = useState<LogisticsRequest[]>(initialLogisticsRequests);

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser,
      items, setItems,
      users, setUsers,
      transactions, setTransactions,
      logisticsRequests, setLogisticsRequests,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
