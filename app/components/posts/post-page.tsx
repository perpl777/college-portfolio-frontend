import { Suspense } from 'react';
import PdfIcon from '@/public/pdf.svg'
import ArrowIcon from '@/public/Arrow.svg'
import Link from 'next/link';
import Image from 'next/image';


interface Props {
    postId: number;
    title: string;
    description?: string;
    publishedAt: string;
    worktype: string;
    url_view?: any;
    url_file?: any;
    studentName: string;
    studentId: number;
}


export default function PostPage({postId, title, description, publishedAt, worktype, url_view, url_file, studentName, studentId}: Props) {
    return (
        <div className='px-11 my-10 flex flex-col justify-between gap-8 max-sm:p-7 max-sm:my-2'>
            <Link href={`#${postId}`} onClick={() => window.history.back()}>
                <Image src={ArrowIcon} alt="Arrow Icon" width={25} />
            </Link>

            <div className='flex justify-between'>
                <p className='text-sm uppercase'>{worktype}</p>
                <p className='text-sm opacity-50'>@{publishedAt.slice(0, 4)}</p>
            </div>
    
            <h1 className='titlePos font-semibold uppercase text-6xl w-8/12 max-sm:text-4xl'>{title}</h1>
    
            <div className='flex justify-between items-end  max-sm:gap-7'>
                <div className='w-7/12 max-sm:w-10/12'>
                    {description && <p className='text-sm opacity-70 pb-14'>{description}</p>}

                    <Link href={`/portfolio/${studentId}`}>
                        <span className='text-sm opacity-70 pb-16 hover:text-cyan-800 transition-colors'>Автор: {studentName}</span>
                    </Link>
                </div>
    
                {url_file 
                ? 
                (
                    <Link href={url_file} target='_blank'>
                        <Suspense fallback={""}>
                            <Image src={PdfIcon} alt="Ссылка на PDF" width={30} />
                        </Suspense>
                    </Link>
                )
                :
                (<></>)
                }
            </div>
    
            {url_view && (
                <Suspense fallback={""}>
                    <Image 
                        src={url_view} 
                        alt="image" 
                        width={500}
                        height={500}
                        className='object-contain w-full h-auto max-w-full max-h-screen'
                    />
                </Suspense>
            )}
        </div>
    );
}