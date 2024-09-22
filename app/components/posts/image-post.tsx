'use client'
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';


interface DataPost {
    href: string;
    studentId: number;
    postId: number;
    photo?: any;
    title: string;
}


const ImagePost = ({ href, studentId, postId, photo, title }: DataPost) => {

    const [blob, setBlob] = useState<Blob | null>(null);
    const divRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchPhoto = () => {
            if (photo) {
                const response = fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL_LOAD_FILES}${photo}`);
                response.then(resp => resp.blob())
                    .then(fetchedBlob => setBlob(fetchedBlob));
            }
        };
    
        fetchPhoto();
    }, [photo]);

    useEffect(() => {
        const handleResize = () => {
            const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
            if (divRef.current) {
            if (isDesktop) {
                gsap.set(divRef.current, { height: 0, overflow: 'hidden' });
            } else {
                gsap.set(divRef.current, { height: 'auto' });
            }
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
        }, []);
    
    const handleMouseEnter = () => {
        if (divRef.current) {
            gsap.to(divRef.current, { height: 'auto', duration: 0.6 });
        }
    };
    
    const handleMouseLeave = () => {
        if (divRef.current) {
            gsap.to(divRef.current, { height: 0, duration: 0.6, onComplete: () => { if (divRef.current) { divRef.current.style.overflow = 'hidden'; } } });
        }
    };
    
    return (
        <Link href={href}>
            <div className='relative' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                {photo ? (
                <div className='cursor-pointer'>
                    {blob ? (
                        <Image src={URL.createObjectURL(blob)} alt="image" className="relative bg-slate-200 object-cover aspect-square w-full" width={500} height={500} quality={75} />
                    ) : (
                        <div className="cursor-pointer border border-gray-400 rounded-sm aspect-square w-full transition-colors hover:bg-gray-200/50"/>
                    )}
                    <div ref={divRef} className='bg-white bg-opacity-70 backdrop-blur-sm w-full absolute bottom-0 items-center'>
                        <p className='text-3xl titlePost uppercase py-5 px-7 max-lg:text-2xl'>{title}</p>
                    </div>
                </div>
                ) : (
                <div className='cursor-pointer border border-gray-400 rounded-sm aspect-square w-full transition-colors hover:bg-gray-200/50'>
                    <div className='w-full absolute bottom-0 items-center'>
                        <p className='text-3xl titlePost uppercase py-6 px-6 max-lg:text-2xl'>{title}</p>
                    </div>
                </div>
                )}
            </div>
        </Link>
    );
};

export default ImagePost