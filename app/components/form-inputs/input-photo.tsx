'use client'
import { useState, useEffect } from 'react';
import { ChangeEvent, useRef } from 'react';
import { isValidImageSize } from '@/lib/utils/validationUtils';
import ErrorMess from '../errorMess';

interface Props {
    setFormDataPhoto: any;
    existingPhoto: any;
}

export default function InputPhoto({ setFormDataPhoto, existingPhoto }: Props ) {
    const [error, setError] = useState<string>('');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [blob, setBlob] = useState<Blob | null>(null);
    const [existingPhotoBlob, setExistingPhotoBlob] = useState<Blob | null>(null);

    useEffect(() => {
        const fetchPhoto = () => {
            if (existingPhoto) {
                const response = fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL_LOAD_FILES}${existingPhoto}`);
                response.then(resp => resp.blob())
                    .then(fetchedBlob => setExistingPhotoBlob(fetchedBlob));
            }
        };
        fetchPhoto();
    }, [existingPhoto]);


    const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }
        const isValid = await isValidImageSize(file, 500, 2000, 800, 5000);
        if (!isValid) {
            setError('Изображение должно быть от 500х500 до 5000х5000 пикселей');
            setBlob(null);
        } else {
            setError('');
            setBlob(file);

            const formDataFile = new FormData();
            formDataFile.append('files', file);
            setFormDataPhoto(formDataFile);
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
                {error == '' && (
                    blob ? (
                        <img className='object-cover' src={blob ? URL.createObjectURL(blob) : ''} alt='uploaded' />
                    ) : existingPhoto ? (
                        <img className='object-cover' src={existingPhotoBlob ? URL.createObjectURL(existingPhotoBlob) : ''} alt='uploaded' />
                    ) : (
                        <div style={{ height: '100%' }}/>
                    )
                )}
            </div>
        </div>
    );
}