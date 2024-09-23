'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import title from '@/public/ПОРТФОЛИО.svg'
import burger from '@/public/bx-menu 2.svg'
import Menu from './menu'


const Header = () => {
    const [menuShow, setMenuShow] = useState(false);
    const handleBurgerClick = () => {
        setMenuShow(!menuShow);
    };
    // отображение меню при наведении и исчезновение
    const HandleMenuAppirance = () => {
        gsap.to(".menu-nav-elenemt", {
            duration: 1,
            stagger: 0.25,
            opacity: menuShow ? 1 : 0,
            y: menuShow ? 0 : -10,
            ease: "slow"
        });
        gsap.to("#menu", { 
            duration: 0.6, 
            opacity: menuShow ? 1 : 0,
            y: menuShow ? 0 : -10,
            ease: "slow" 
        });
    }
    
    useEffect(() => {
        HandleMenuAppirance();
    }, [menuShow]);

    useEffect(() => {
        gsap.from(".title", { 
            x: 100, 
            opacity: 0, 
            duration: 0.4, 
        }); 
        gsap.to(".title", { 
            x: 0, 
            opacity: 1, 
            duration: 0.6, 
        }); 
    }, []);
    
    return (
        <div className='flex flex-col px-11 pt-2 max-sm:px-4 max-sm:pt-0'>
            <div className='flex items-start justify-between py-7 gap-5 border-b border-black'>
                <Image onClick={handleBurgerClick} src={burger} alt='burger' className='flex w-auto title z-1 resize relative cursor-pointer'/>
                <Menu setMenuShow={setMenuShow} HandleMenuAppirance={HandleMenuAppirance} />
                <div>
                    <Image src={title} alt='title' className='flex w-auto title z-1 resize relative'/>
                </div>
            </div> 
        </div>
    )
}

export default Header