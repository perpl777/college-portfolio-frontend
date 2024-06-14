'use client'
import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';


interface DataPost {
    url_view?: string
    title: string
    worktype: string
}


const ImagePost = ({url_view, title, worktype}: DataPost) => {

    const divRef = useRef<HTMLDivElement | null>(null);

    //анимация появления заголовка
    useEffect(() => {
        if (divRef.current) {
            gsap.set(divRef.current, { height: 0, overflow: 'hidden' });
        }
    }, []);

    const handleMouseEnter = () => {
        if (divRef.current) {
            gsap.to(divRef.current, { height: 'auto', duration: 0.6});
        }
    };

    const handleMouseLeave = () => {
        if (divRef.current) {
            gsap.to(divRef.current, {
                height: 0, 
                duration: 0.6, 
                onComplete: () => {
                    if (divRef.current) {
                        divRef.current.style.overflow = 'hidden';
                    }
                }
            });
        }
    };
    
    return (
        <div className='relative' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            { url_view 
            ? 
            <div className='cursor-pointer'>
                <Image
                    src={url_view}
                    alt="image"
                    className="relative bg-slate-200 object-cover aspect-square w-full"
                    width={500}
                    height={500}
                    quality={75}
                />
                <div ref={divRef} className=' bg-white bg-opacity-70 backdrop-blur-sm w-full absolute bottom-0 items-center'>
                    <p className='text-3xl titlePost uppercase py-5 px-7 max-lg:text-2xl'>{title}</p>
                </div>
            </div>
            :
            <div className='cursor-pointer'>
                <div className='p-5 border border-gray-400 rounded-sm aspect-square w-full'>
                    <div
                        className={`border rounded-sm border-gray-400 py-1 px-3 w-32 text-xs text-gray-600`}
                    >
                        # веб-разработка
                    </div>
                </div>
                <div className='w-full absolute bottom-0 items-center'>
                    <p className='text-3xl titlePost uppercase py-6 px-6  max-lg:text-2xl '>{title}</p>
                </div>
            </div>
            }
        </div>
    )
}

export default ImagePost