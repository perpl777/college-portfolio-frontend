'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import title from '@/public/ПОРТФОЛИО.svg'
import Menu from './menu'


const Header = () => {
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
        <div className='flex flex-col px-11 pt-4 max-sm:px-6 max-sm:pt-2'>
            <div className='flex items-start justify-between py-7 gap-5 border-b border-black'>
                <Menu/>
                <div>
                    <Image src={title} alt='title' className='flex w-auto title z-1 resize relative'/>
                </div>
            </div> 
        </div>
    )
}

export default Header