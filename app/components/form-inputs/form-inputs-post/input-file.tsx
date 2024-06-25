'use client'
import React, {useState} from 'react';
import { ChangeEvent, useRef } from 'react';
import Link from 'next/link'


export default function InputFile() {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [blobFile, setBlobFile] = useState<File | null>(null);

    //для загурузки файла
    const handleFileChange = (event: any) => {
        const file = event.target.files[0];
        if (!file) {
        return;
        }
        setBlobFile(file);
    };

    const handleClickFile = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className='flex rounded-xl border border-gray-800 h-12 w-[320px]'>
            <button
                className='bg-black rounded-l-xl flex items-center justify-center w-1/2 cursor-pointer text-gray-500 text-md'
                onClick={handleClickFile}
            >
                Выбрать файл
            </button>
            <Link href={blobFile ? URL.createObjectURL(blobFile) : ''} target='_blank' className="rounded-r-xl px-3 flex items-center w-1/2">
                <button
                    onClick={handleClickFile}
                    className='overflow-hidden whitespace-nowrap text-ellipsis w-11/12 cursor-pointer outline-none text-gray-600 text-sm'>
                    {blobFile ? <p>{blobFile.name}</p> : 'Файл не выбран'}
                </button>
            </Link>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </div>
    );
}
