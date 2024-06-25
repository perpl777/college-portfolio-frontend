'use client'
import { useState } from 'react';
import { ChangeEvent, useRef } from 'react';
import Image from "next/image";
import Plus from '@/public/plus.svg'



export default function InputPhoto() {

    const [selectedFile, setSelectedFile] = useState(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [blob, setBlob] = useState<Blob | null>(null);

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }
        setBlob(file);
    };
    
    const handleClick = (event: React.FormEvent<any>) => {
        event.preventDefault()
        fileInputRef.current?.click();
    };

    return (
        <div className={`flex  items-center justify-center w-full h-full border border-gray-500`} style={{ minHeight: '300px' }}>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} />
            <div className="absolute" onClick={handleClick}>
                <button className="w-48 bg-white h-11 border rounded-[4px] border-gray-500  font-semibold text-base text-black hover:bg-black hover:text-white transition-all">
                Выбрать файл
                </button>
            </div>
            <div className='overflow-hidde flex justify-center items-center' style={{ minHeight: '300px' }}>
                {blob ? (
                <img className='object-cover' src={blob ? URL.createObjectURL(blob) : ''} alt='uploaded' />
                ) : (
                <div style={{ height: '100%' }}/>
                )}
            </div>
        </div>
    );
}