'use client'
import React from 'react';
import { UserProvider } from './components/context';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      {children}
    </UserProvider>
  );
}