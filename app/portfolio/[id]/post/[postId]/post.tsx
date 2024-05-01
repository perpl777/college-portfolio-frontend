import { Suspense } from 'react';
import Loading from '@/app/loading';
import ArrowIcon from '@/public/Arrow.svg'
import PdfIcon from '@/public/pdf.svg'
import Link from 'next/link';
import Image from 'next/image';


interface Props {
    postId: number;
    title: string;
    description?: string;
    link?: string;
    publishedAt: string;
    work_type: string;
    photo?: any;
    file?: any;
}


export default function PostWindow({postId, title, description, link, publishedAt, work_type, photo, file}: Props) {

    return (
        <div className='p-11 flex flex-col justify-between gap-8 max-sm:p-7'>
            <Link href={`#${postId}`} onClick={() => window.history.back()}>
                <Image src={ArrowIcon} alt="Arrow Icon" width={25} />
            </Link>

            <div className='flex justify-between'>
                <p className='text-sm uppercase'>{work_type}</p>
                <p className='text-sm opacity-50'>@{publishedAt.slice(0, 4)}</p>
            </div>
    
            <h1 className='titlePos font-semibold uppercase text-6xl w-8/12 max-sm:text-4xl'>{title}</h1>
    
            <div className='flex justify-between items-end max-sm:flex-col max-sm:items-start max-sm:gap-7'>
                <div className='w-7/12 max-sm:w-10/12'>
                {description && <p className='text-sm opacity-70 pb-14'>{description}</p>}
    
                {link && (
                    <Link href={link} target='_blank' className='cursor-pointer text-sm text-slate-400 hover:text-sky-800'>
                        Ссылка: {link}
                    </Link>
                )}
                </div>
    
                {file 
                ? 
                (

                    <Link href={file} target='_blank'>
                        <Suspense fallback={""}>
                            <Image src={PdfIcon} alt="Ссылка на PDF" width={30} />
                        </Suspense>
                    </Link>
                )
                :
                (<></>)
                }
            </div>
    
            {photo && (
                <Image 
                    src={photo} 
                    alt="image" 
                    width={500}
                    height={500}
                    quality={80} 
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
            )}
        </div>
    );
}