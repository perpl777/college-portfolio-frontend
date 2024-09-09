// userContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { UserRoleProps, User } from '../components/interfaces';
import { fetcher } from '@/lib/api';
import { getAuthData } from '@/lib/auth';
import Cookies from 'js-cookie';

interface UserContextProps {
    id?: string;
    jwt?: string;
    user?: User;
    role?: UserRoleProps["role"]["name"];
    loading: boolean;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { id } = getAuthData();
  const { jwt } = getAuthData();

  const [user, setUser] = useState<User | undefined>(undefined);
  const [role, setUserRole] = useState<UserContextProps["role"] | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        const userDataResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/${id}?populate=*`);
        setUser(userDataResponse);
            
        setUserRole(userDataResponse.role.name);
        setLoading(false);
        console.log(userDataResponse)
        console.log('userDataResponse.role', userDataResponse.role.name)
    };

    fetchData();
  }, [id]);

  return (
    <UserContext.Provider value={{ id, jwt, user, role, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
