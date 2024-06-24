'use client'
import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const StudentNav = () => {
  const pathname = usePathname();
  
  const menuItems = useMemo(() => [
    { title: 'ПОРТФОЛИО', path: '/student-personal/portfolio' },
    { title: 'ПРОФИЛЬ', path: '/student-personal/profile' },
    { title: 'СТАТИСТИКА', path: '/student-personal/statistics' },
  ], []);
  

  // Разделяем активный элемент и прочие
  const activeItem = menuItems.find(item => item.path === pathname);
  const inactiveItems = menuItems.filter(item => item.path !== pathname);

  // Составляем новый массив так, чтобы активный элемент был последним
  const sortedMenuItems = activeItem ? [...inactiveItems, activeItem] : menuItems;

  return (
    <nav className='flex justify-end items-end gap-x-4 text-lg'>
      {sortedMenuItems.map((item, index) => (
        <Link href={item.path} key={index} className=''>
          <span 
          className={`
            transition-all 
            duration-300 
            ${pathname === item.path 
            ? 'text-5xl font-semibold transform translate-x-5' 
            : ''}`}>
              {item.title}
          </span>
        </Link>
      ))}
    </nav>
  );
};

export default StudentNav;
  