import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Item, User, Transaction, Role, LogisticsRequest, BorrowRequestTicket } from './types';
import { initialItems, initialUsers, initialTransactions, initialLogisticsRequests, initialBorrowRequestTickets } from './store';
import { ThemeMode, applyTheme, getPreferredTheme, persistTheme } from './theme';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  logisticsRequests: LogisticsRequest[];
  setLogisticsRequests: React.Dispatch<React.SetStateAction<LogisticsRequest[]>>;
  borrowRequestTickets: BorrowRequestTicket[];
  setBorrowRequestTickets: React.Dispatch<React.SetStateAction<BorrowRequestTicket[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(users[0]); // Default to Super Admin
  const [theme, setTheme] = useState<ThemeMode>(() => getPreferredTheme());
  const [items, setItems] = useState<Item[]>(initialItems);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [logisticsRequests, setLogisticsRequests] = useState<LogisticsRequest[]>(initialLogisticsRequests);
  const [borrowRequestTickets, setBorrowRequestTickets] = useState<BorrowRequestTicket[]>(initialBorrowRequestTickets);

  useEffect(() => {
    applyTheme(theme);
    persistTheme(theme);
  }, [theme]);

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser,
      theme, setTheme,
      items, setItems,
      users, setUsers,
      transactions, setTransactions,
      logisticsRequests, setLogisticsRequests,
      borrowRequestTickets, setBorrowRequestTickets,
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
