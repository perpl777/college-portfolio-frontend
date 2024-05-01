'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';


interface DataPost {
    title: string,
    markupWithBackground: boolean,
    publishedAt: string,
    work_type: string
    photo?: string
}


const Post = ({title, markupWithBackground, publishedAt, work_type, photo}: DataPost) => {


    const colors = ['bg-stone-800', 'bg-blue-800/40'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const [blob, setBlob] = useState<Blob | null>(null);

    useEffect(() => {
        const fetchPhoto = async () => {
            if (photo) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL_UPLOAD}${photo}`);
                const fetchedBlob = await response.blob();
                setBlob(fetchedBlob);
            }
        };

        fetchPhoto();
    }, [photo]);

    return (
        <div className='flex flex-row cursor-pointer'>
            {blob 
            ? (
                <>
                    <div className='p-11 flex flex-col w-1/2 justify-between gap-14 border-t border-x border-black max-[1040px]:gap-5 max-md:p-3 hover:bg-slate-200 transition-all'>
                        <div className='flex justify-between'>
                            <p className='text-sm uppercase max-sm:text-xs'>{work_type}</p>
                            <p className='text-sm opacity-50 max-sm:text-xs'>@{publishedAt.slice(0,4)}</p>
                        </div>
                        <h1 className='titlePos font-semibold uppercase text-6xl max-w-[500px] max-[1040px]:text-4xl max-md:text-lg max-md:leading-7 break-words break-word'>{title}</h1>
                    </div>
                    <div className='border-t border-r border-black w-1/2'>
                        <Image
                            src={blob ? URL.createObjectURL(blob) : ''}
                            alt="image" 
                            loading="lazy"
                            quality={80}
                            width={500}
                            height={500}
                            className={markupWithBackground
                                ? `w-full h-full object-contain p-28 ${randomColor} max-lg:p-20 max-md:p-14 max-[500px]:p-8`
                                : `w-full h-full object-cover`
                            }
                        />
                    </div>
                </>
                )
            :
                (
                <>
                    <div className='p-11 flex flex-col w-full justify-between gap-24 border-t border-x border-black max-[1040px]:gap-5 max-md:p-3  hover:bg-slate-200 transition-all'>
                        <div className='flex justify-between'>
                            <p className='text-sm uppercase max-sm:text-xs'>{work_type}</p>
                            <p className='text-sm opacity-50 max-sm:text-xs'>@{publishedAt.slice(0,4)}</p>
                        </div>
                        <h1 className='titlePos w-1/2 font-semibold uppercase text-6xl max-w-[500px] max-[1040px]:text-4xl max-md:text-lg max-md:leading-7'>{title}</h1>
                    </div>
                </>
                )
            }
        </div>
    )
}

export default Post