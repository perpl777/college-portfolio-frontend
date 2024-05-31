'use client'
import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';


interface DataPost {
    photo?: string
    title: string
    work_type: string
}


const ImagePost = ({photo, title, work_type}: DataPost) => {

    const [blob, setBlob] = useState<Blob | null>(null);

    const divRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        const fetchPhoto = () => {
            if (photo) {
                const response = fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL_UPLOAD}${photo}`);
                response.then(resp => resp.blob())
                    .then(fetchedBlob => setBlob(fetchedBlob));
            }
        };
    
        fetchPhoto();
    }, [photo]);


    useEffect(() => {
        if (divRef.current) {
            gsap.set(divRef.current, { height: 0, overflow: 'hidden' });
        }
    }, []);

    const handleMouseEnter = () => {
        if (divRef.current) {
            gsap.to(divRef.current, { height: 'auto', duration: 0.6 });
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
            { photo 
            ? 
            <div className='cursor-pointer'>
                <Image
                    src={blob ? URL.createObjectURL(blob) : ''}
                    alt="image" 
                    quality={80}
                    width={440}
                    height={350}
                    style={{ objectFit: 'cover', width: '440px', height: '350px' }}
                    className='relative bg-slate-200 '
                />
                <div ref={divRef} className=' bg-white bg-opacity-70 backdrop-blur-sm w-full absolute bottom-0 items-center'>
                    <p className='text-2xl titlePost uppercase py-6 px-8'>{title}</p>
                </div>
            </div>
            :
            <div className='cursor-pointer'>
                <div className='p-5 border border-gray-400 rounded-sm' style={{ height: '350px' }}>
                <div
                    className={`border rounded-sm border-gray-400 py-1 px-3 w-32 text-xs text-gray-600`}
                >
                    # веб-разработка
                </div>
                </div>
                <div className='w-full absolute bottom-0 items-center'>
                    <p className='text-2xl titlePost uppercase py-6 px-6'>{title}</p>
                </div>
            </div>
            }
        </div>
    )
}

export default ImagePost