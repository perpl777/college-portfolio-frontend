'use client'
import { useState } from 'react';
import { ChangeEvent, useRef } from 'react';
import { isValidImageSize } from '@/lib/utils/validationUtils';
import ErrorMess from '../errorMess';



export default function InputPhoto() {

    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState<string>('');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [blob, setBlob] = useState<Blob | null>(null);

    const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }
        const isValid = await isValidImageSize(file, 1000, 2000, 1000, 2000);
        if (!isValid) {
            setError('Изображение должно быть от 1000х1000 до 2000х2000 пикселей');
            setBlob(null);
        } else {
            setError('');
            setBlob(file);
        }
    };
    
    const handleClick = (event: React.FormEvent<any>) => {
        event.preventDefault()
        fileInputRef.current?.click();
    };

    return (
        <div className={`relative flex items-center justify-center m-y-4 border border-gray-500 min-h-80 max-h-96 min-w-full`}>
            <input 
                type="file"
                accept=".png, .jpg, .jpeg"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: 'none' }}
            />
            <div className='max-w-72 absolute top-0 m-5'>
                {error != '' && <ErrorMess text={error}/>}
            </div>
            <div className="absolute flex flex-col items-center" onClick={handleClick}>
                <button className="w-48 bg-white h-11 border rounded-[4px] border-gray-500  font-semibold text-base text-black hover:bg-black hover:text-white transition-all">
                Выбрать файл
                </button>
            </div>
            <div className='overflow-hidden flex justify-center items-center w-full min-h-80 max-h-96'>
                { error == '' && blob ? (
                 <img className='w-full' src={blob ? URL.createObjectURL(blob) : ''} alt='uploaded' />
                ) : (
                <div style={{ height: '100%' }}/>
                )}
            </div>
        </div>
    );
}