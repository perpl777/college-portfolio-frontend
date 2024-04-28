'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';


interface FileInputProps {
    value: string;
}

const FileInput: React.FC<FileInputProps> = ({ value }) => {
    
    const [blobFile, setBlobFile] = useState<Blob | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (value) {
                const response = await fetch(`http://localhost:1337${value}`);
                const fetchedBlob = await response.blob();
                setBlobFile(fetchedBlob);
            }
    };
        fetchData();
    }, []);

    
    return (
        <div className='flex rounded-xl border border-gray-800 h-12 w-[320px]'>
            <input className=' bg-black rounded-l-xl flex text-center w-1/2 cursor-pointer' placeholder='Выбрать файл'/>
            
            <Link href={blobFile ? URL.createObjectURL(blobFile) : ''} target='_blank' className="rounded-r-xl px-3 flex items-center w-1/2">
                <button className='overflow-hidden whitespace-nowrap text-ellipsis w-11/12 cursor-pointer outline-none appearance-none text-gray-600 text-sm'>
                    {value ? value : 'Файл не выбран'}
                </button>
            </Link>

        </div>
    );
};
    
export default FileInput;