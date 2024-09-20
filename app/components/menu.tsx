'use client'

import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap'
import { fetcher } from "@/lib/api"
import Link from 'next/link'

import { getAuthData, unsetAuthData } from '@/lib/auth';
import Cookies from 'js-cookie';

import Modals from './modals/modals';


interface UserNameProps {
    student: {
        name: string
    }
    role: {
        name: string
    }
}

interface MenuProps {
    setMenuShow: React.Dispatch<React.SetStateAction<boolean>>;
    HandleMenuAppirance: () => void; 
}


const Menu: React.FC<MenuProps> = ({ setMenuShow, HandleMenuAppirance }) => {
    const { id } = getAuthData();
    const [user, setUser] = useState<string | null>(null);
    const [userName, setUserName] = useState<UserNameProps>();
    const [loading, setLoading] = useState(true);

    //modals
    const [openModalLogin, setOpenModalLogin] = useState(false);
    const [openModalRegister, setOpenModalRegister] = useState(false);
    const [openModalRecovery, setOpenModalRecovery] = useState(false);


    //фетч к юзеру
    useEffect(() => {     
        const fetchData = async () => {     
            const userDataResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/${id}?populate=*`);
            setUserName(userDataResponse)
        };
        fetchData();   
    }, []);

    
    // хэндлы для модалки авторизации
    const handleOpenModalLogin = () => {
        if (openModalRegister) {
            setOpenModalRegister(false)
        }
        if(openModalRecovery) {
            setOpenModalRecovery(false)
        }
        setOpenModalLogin(!openModalLogin);
    };

    const handleCloseModalLogin = () => {
        setOpenModalLogin(false);
    };


    //получение email user
    useEffect(() => {
        const userData = Cookies.get('email');
        if (userData) {
            setUser(userData);
        }
        setLoading(false);
    }, []);
    

    // обработка выхода
    const logout = () => {
        unsetAuthData()
        window.location.href = '/';
    }


    //--------- anim click appirance menu----------

    const handleMouseEnter = () => {
        setMenuShow(true);
        HandleMenuAppirance();
    };

    // const handleMouseLeave = () => {
    //     setMenuHide(true);
    //     HandleMenuAppirance();
    // };


    // появление меню при скролле верх 
    useEffect(() => {
    //--------- anim scroll appirance menu----------
        let lastScrollTop = 0;
        const handleScroll = () => {
            const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
            if (currentScrollTop > lastScrollTop || currentScrollTop <= 0) {
                gsap.to("#menu", { opacity: 0, y: -10,  duration: 0.6, ease: "slow" });
                gsap.to(".menu-nav-elenemt", { 
                    opacity: 0,
                    y: -10,
                    duration: 1, 
                    ease: "slow" 
                });
                setMenuShow(false);
            } else {
                gsap.to("#menu", { opacity: 1, y: 0, duration: 0.6, ease: "slow" });
                gsap.to(".menu-nav-elenemt", { 
                    opacity: 1,
                    y: 0,
                    duration: 1, 
                    ease: "slow" 
                });
                setMenuShow(true);
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
            <div 
                id="menu" 
                onMouseEnter={handleMouseEnter}
                // onMouseLeave={handleMouseLeave}
                className='fixed z-20 opacity-0 top-0 left-0 right-0 box-border 
                text-black backdrop-blur-sm bg-white/70 '>
                    
                <div className='flex justify-between align-text-bottom items-center py-3 border-b tracking-wide border-black'>
                    
                    <div className='ml-12 space-x-12 max-sm:ml-6 max-sm:space-x-6 max-sm:text-sm'>
                        <Link href={`/`}>
                            <span className={"menu-nav-elenemt hover:text-gray-400"}>
                                Главная
                            </span>
                        </Link>
                        <Link href={`/students`}>
                            <span className={"menu-nav-elenemt hover:text-gray-400"}>
                                Студенты
                            </span>
                        </Link>
                    </div>

                    <div className='mr-12 space-x-12 max-sm:mr-6 max-sm:space-x-6 max-sm:text-sm'>
                        {user ? (
                            <>
                                { userName?.role.name === "Authenticated" &&
                                    <Link href={`/myprofile`}>
                                        <span className={"menu-nav-elenemt hover:text-gray-400"}>Профиль</span>
                                    </Link>
                                }
                                { userName?.role.name === "Moderator" &&
                                    <Link href={`/moderation`}>
                                        <span className={"menu-nav-elenemt hover:text-gray-400"}>Профиль</span>
                                    </Link>
                                }
                                { userName?.role.name === "Statistic" &&
                                    <Link href={`/statistic`}>
                                        <span className={"menu-nav-elenemt hover:text-gray-400"}>Профиль</span>
                                    </Link>
                                }
                                    <a onClick={logout} className='menu-nav-elenemt hover:text-gray-400 cursor-pointer'>Выход</a>
                            </>
                            ) : (
                            <>
                                <button onClick={handleOpenModalLogin}>
                                    <span className={"menu-nav-elenemt hover:text-gray-400"}>
                                        Вход
                                    </span>
                                </button>
                            </>
                            )}
                            
                        </div>
                </div>
            </div>

            <Modals
                openModalLogin={openModalLogin}
                setOpenModalLogin={setOpenModalLogin}
                handleOpenModalLogin={handleOpenModalLogin}
                handleCloseModalLogin={handleCloseModalLogin}
                openModalRegister={openModalRegister}
                setOpenModalRegister={setOpenModalRegister}
                openModalRecovery={openModalRecovery}
                setOpenModalRecovery={setOpenModalRecovery}
            />
        </div>
    );
};
export default Menu
