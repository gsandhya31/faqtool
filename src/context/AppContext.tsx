import React, { createContext, useContext, useState } from 'react';
import { AppContextType, UserRole, User } from '@/types';
import { mockUsers } from '@/data/mockData';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('user');
  
  const currentUser: User = currentRole === 'admin' 
    ? mockUsers.find(u => u.role === 'admin')! 
    : mockUsers.find(u => u.role === 'user')!;

  return (
    <AppContext.Provider value={{ currentUser, currentRole, setCurrentRole }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};