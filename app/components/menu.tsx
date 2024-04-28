'use client'

import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap'
import Image from 'next/image'
import Link from 'next/link'
import logo from '@/public/logo.webp'

import { setAuthData, unsetAuthData } from '@/lib/auth';
import Cookies from 'js-cookie';


interface MenuProps {
    adminPage: boolean;
}


const Menu = ({adminPage}: MenuProps) => {

    
    const [user, setUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = Cookies.get('username');

        if (userData) {
            setUser(userData);
        }

        setLoading(false);
    }, []);


    const logout = () => {
        unsetAuthData()
        window.location.href = '/';
    }
    
    const [menuHide, setMenuHide] = useState(true);

  //--------- anim click appirance menu----------
    const handleMouseEnter = () => {
        setMenuHide(false);
        HandleMenuAppirance();
    };
    const handleMouseLeave = () => {
        setMenuHide(true);
        HandleMenuAppirance();

    };
    const HandleMenuAppirance = () => {
        gsap.to(".menu-nav-elenemt", {
            duration: 1,
            stagger: 0.25,
            opacity: menuHide ? 1 : 0,
            y: menuHide ? 0 : -10,
            ease: "slow"
        });
        gsap.to("#menu", { 
            duration: 0.6, 
            opacity: menuHide ? 1 : 0,
            y: menuHide ? 0 : -10,
            ease: "slow" 
        });
    }
    const HandleBurgerClick = () => {
        setMenuHide(true);
        gsap.to(".menu-nav-elenemt", {
            duration: 1,
            stagger: 0.25,
            opacity: 1,
            y: 0,
            ease: "slow"
        });
        gsap.to("#menu", { 
            duration: 0.6, 
            opacity: 1,
            y: 0,
            ease: "slow" 
        });
    }

    useEffect(() => {
  //--------- anim scroll appirance menu----------
        let lastScrollTop = 0;
        const handleScroll = () => {
            const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
        
            if (currentScrollTop > lastScrollTop || currentScrollTop <= 0) {
                // setMenuOpen(true);
                // HandleMenuAppirance();
                gsap.to("#menu", { opacity: 0, y: -10,  duration: 0.6, ease: "slow" });
                gsap.to(".menu-nav-elenemt", { 
                    opacity: 0,
                    y: -10,
                    duration: 1, 
                    ease: "slow" 
                });
                setMenuHide(false);
        
            } else {
                // setMenuOpen(false);
                // HandleMenuAppirance();
        
                gsap.to("#menu", { opacity: 1, y: 0, duration: 0.6, ease: "slow" });
                gsap.to(".menu-nav-elenemt", { 
                    opacity: 1,
                    y: 0,
                    duration: 1, 
                    ease: "slow" 
                });
                setMenuHide(true);
            }
            lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };


    }, []);
    
    return (
        <div>
            { /*-------------- Burger-menu ------------------*/}
            <div className='w-6 h-auto'>
                <Image 
                    src={logo} 
                    width={38} height={38}
                    alt='logo' 
                    className='flex cursor-pointer z-10 w-6'
                    onClick={HandleBurgerClick} 
                />
            </div> 
            {/*-------------- Full nav ------------------*/}
            <div 
                id="menu" 
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className='fixed z-20 opacity-0 top-0 left-0 right-0 box-border 
                text-black backdrop-blur-sm bg-white/70 '>
                    
                <div className='flex justify-between align-text-bottom items-center py-3 border-b tracking-wide border-black'>
                    <div>
                        <Link href={`/`}>
                            <span className={"menu-nav-elenemt ml-12 hover:text-gray-400 max-sm:ml-5 max-sm:text-xs"}>
                                Главная
                            </span>
                        </Link>
                        {user ? (
                            <>
                                <Link href={`/admin`}>
                                    <span className={"menu-nav-elenemt ml-12 hover:text-gray-400 max-sm:ml-5 max-sm:text-xs"}>
                                        Профиль
                                    </span>
                                </Link>
                                <a onClick={logout} className='menu-nav-elenemt ml-12 hover:text-gray-400 cursor-pointer max-sm:ml-5 max-sm:text-xs'>Выйти</a>
                            </>
                        ) : (
                            <>
                                <Link href={`/auth`}>
                                    <span className={"menu-nav-elenemt ml-12 hover:text-gray-400 max-sm:ml-5 max-sm:text-xs"}>
                                        Кураторам
                                    </span>
                                </Link>
                            </>
                        )}
                    </div>

                    <div className='menu-nav-elenemt mr-12 max-sm:mr-5 max-sm:text-xs'>{user}</div>
                </div>
            </div>
        </div>
    );
};
export default Menu
