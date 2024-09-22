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
    photo?: string;
    file?: string;
    studentName: string;
    studentId: number;
}


export default function PostPage({postId, title, description, publishedAt, worktype, photo, file, studentName, studentId}: Props) {
    function makeLinksClickable(text: string) {
        const urlPattern = /(\bhttps?:\/\/[^\s]+)/g;
        return text.replace(urlPattern, url => `<a href="${url}" 
            style="
                font-size: 0.875rem;
                opacity: 0.7;
                padding-bottom: 4rem;
                color: #0e7490;
            " target="_blank" rel="noopener noreferrer">${url}</a>`);
    }

    return (
        <div className='px-11 my-12 flex flex-col justify-between gap-6 max-sm:p-4 max-sm:my-4'>
            <Link href={`#${postId}`} onClick={() => window.history.back()}>
                <Image src={ArrowIcon} alt="Arrow Icon" width={25} />
            </Link>

            <div className='flex justify-between pt-4 max-sm:pt-0'>
                <p className='text-sm uppercase'>{worktype}</p>
                <p className='text-sm opacity-50'>@{publishedAt.slice(0, 4)}</p>
            </div>
    
            <h1 className='titlePos font-semibold uppercase text-6xl w-8/12 max-sm:text-4xl'>{title}</h1>
    
            <div className='flex justify-between items-end  max-sm:gap-7'>
                <div className='w-7/12 max-sm:w-10/12'>
                    {description && <p className='text-sm opacity-70 pb-14'>{<p dangerouslySetInnerHTML={{ __html: makeLinksClickable(description) }} />}</p>}

                    <Link href={`/portfolio/${studentId}`}>
                        <span className='text-sm opacity-70 pb-16 hover:text-cyan-800 transition-colors'>Автор: {studentName}</span>
                    </Link>
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
                <Suspense fallback={""}>
                    <Image 
                        src={photo} 
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