'use client'
import React, { createContext, useContext, useState, ReactNode, FC } from 'react';

interface UserContextType {
    userId: number;
    setUserId: React.Dispatch<React.SetStateAction<number>>;
}

// Указываем начальное значение для контекста
const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
    const [userId, setUserId] = useState(1); // захардкоженное значение 1

    return (
        <UserContext.Provider value={{ userId, setUserId }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
