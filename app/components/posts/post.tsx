'use client'
import React from 'react';
import Image from 'next/image';


interface DataPost {
    title: string,
    background: boolean,
    publishedAt: string,
    worktype: string
    url_view?: string
}


const Post = ({title, background, publishedAt, worktype, url_view}: DataPost) => {

    const colors = ['bg-stone-800', 'bg-blue-800/40'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    return (
        <div className='flex flex-row cursor-pointer'>
            {url_view 
            ? (
                <>
                    <div className='p-11 flex flex-col w-1/2 justify-between gap-14 border-t border-x border-black max-[1040px]:gap-5  max-md:py-5 max-md:p-4 hover:bg-slate-200 transition-all'>
                        <div className='flex justify-between'>
                            <p className='text-sm uppercase max-sm:text-xs'>{worktype}</p>
                            <p className='text-sm opacity-50 max-sm:text-xs'>@{publishedAt.slice(0,4)}</p>
                        </div>
                        <h1 className='titlePost uppercase text-6xl max-w-[500px] max-[1040px]:text-5xl max-md:text-base max-md:leading-5 break-words break-word'>{title}</h1>
                    </div>
                    <div className='border-t border-r border-black w-1/2'>
                        <Image
                            src={url_view}
                            alt="image" 
                            quality={80}
                            width={500}
                            height={500}
                            className={background
                                ? `w-full h-full object-contain aspect-square p-28 ${randomColor} max-lg:p-20 max-md:p-14 max-[500px]:p-8`
                                : `w-full h-full object-cover aspect-square`
                            }
                        />
                    </div>
                </>
                )
            :
                (
                <>
                    <div className='p-11 flex flex-col w-full justify-between gap-24 border-t border-x border-black max-[1040px]:gap-5 max-md:p-4 max-md:py-5  hover:bg-slate-200 transition-all'>
                        <div className='flex justify-between max-sm:space-y-6'>
                            <p className='text-sm uppercase max-sm:text-xs'>{worktype}</p>
                            <p className='text-sm opacity-50 max-sm:text-xs'>@{publishedAt.slice(0,4)}</p>
                        </div>
                        <h1 className='titlePost w-1/2 uppercase text-6xl max-w-[500px] max-[1040px]:text-5xl max-md:text-base max-md:leading-5'>{title}</h1>
                    </div>
                </>
                )
            }
        </div>
    )
}

export default Post