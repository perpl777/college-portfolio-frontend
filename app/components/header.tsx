'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import title from '@/public/ПОРТФОЛИО.svg'
import Menu from './menu'


const Header = () => {

    const textsNav = [
        {text: "Новосибирский колледж печати и информационных технологий"},
        {text: "Новосибирский колледж"},
        {text: "Новосибирский колледж печати и информационных технологий"},
    ]

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

        gsap.from(".title-decor", { 
            delay: 0.7,

            x: -100,
            opacity: 0, 
            duration: 1, 
        }); 
        gsap.to(".title-decor", { 
            delay: 1,
            x: 0,
            opacity: 1, 
            duration: 1, 
        }); 
    }, []);

    return (
        <div className='flex flex-col px-11 pt-11'>
            <div className='flex items-start justify-between py-7 gap-5 border-b border-black'>
                <Menu adminPage={false}/>
                <div>
                    <Image src={title} alt='title' className='flex w-auto title z-1 resize relative'/>
                </div>
            </div> 

            <div className='justify-end mt-4 mr-16 gap-36 hidden sm:flex'>
                {textsNav.map((textNav, index) => 
                    <p 
                        key={index}
                        className='title-decor text-gray-400 w-44 text-sm leading-4 hidden lg:block'>
                            {textNav.text}
                    </p>
                )}
            </div>
        </div>
    )
}

export default Header