'use client'
import React, {useState} from 'react';
import { useRef } from 'react';
import Link from 'next/link'
import { isValidFileSize } from '@/lib/utils/validationUtils'


interface Props {
    setFormDataFile: any;
    existingFile: any;
}

export default function InputFile({ setFormDataFile, existingFile }: Props ) {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [blobFile, setBlobFile] = useState<File | null>(null);
    const [error, setError] = useState<string>('');

    const handleFileChange = async (event: any) => {
        const file = event.target.files[0];
        if (!file) {
        return;
        }
        const isValidSize = await isValidFileSize(file, 20 )

        if (!isValidSize) {
            setError('Слишком большой файл');
            setBlobFile(null);
        } else {
            setError('')
            setBlobFile(file);

            const formDataFile = new FormData();
            formDataFile.append('files', file);
            setFormDataFile(formDataFile);
        }
    };

    const handleClickFile = (event: React.FormEvent<any>) => {
        event.preventDefault()
        fileInputRef.current?.click();
        setError('')
    };

    return (
        <div className='pb-5'>
            <div className='flex rounded-xl border border-gray-800 h-12 w-[300px] m-0 '>
                <button
                    className='bg-black rounded-l-xl flex items-center justify-center w-1/2 cursor-pointer text-gray-500 text-md'
                    onClick={handleClickFile}
                >
                    Выбрать файл
                </button>
                <Link
                    href={blobFile ? URL.createObjectURL(blobFile) : ''}
                    target='_blank'
                    className="rounded-r-xl px-3 flex items-center w-1/2"
                >
                    <button
                        onClick={handleClickFile}
                        className='overflow-hidden whitespace-nowrap text-ellipsis w-11/12 cursor-pointer outline-none text-gray-600 text-sm'>                    
                        {existingFile ? (
                            <p>{existingFile}</p>
                        ) : blobFile ? (
                            <p>{blobFile.name}</p>
                        ) : (
                            <p>Файл не выбран</p>
                        )}
                    </button>
                </Link>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    accept="
                    .png, .jpg, .jpeg, 
                    .mpeg, .mp4, .mp3, 
                    .pdf, .doc, .docx, 
                    .heic, .heif"
                />
            </div>
            <span className='text-gray-600 text-sm'>
                {error !== '' && error}
            </span>
        </div>
    );
}
