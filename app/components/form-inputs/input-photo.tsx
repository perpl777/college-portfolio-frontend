'use client'
import { useState, useEffect } from 'react';
import { ChangeEvent, useRef } from 'react';
import { isValidFileSize, isValidImageSizeWithAspect } from '@/lib/utils/validationUtils'
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

        const aspectRatioTolerance = 0.2;  // 10% допустимого отклонения

        // Проверка размера файла
        const isValidSize = await isValidFileSize(file, 20);
        // Проверка разрешения изображения
        const isValidResolution = await isValidImageSizeWithAspect(
            file,
            aspectRatioTolerance
        );


        if (!isValidSize) {
            setError('Слишком большой файл');
            setBlob(null);
        } else if (isValidSize && isValidResolution.isValidSize && isValidResolution.isAspectRatioValid) {            
            // Установка состояния для успешной загрузки
            setError('');
            setBlob(file);
    
            const formDataFile = new FormData();
            formDataFile.append('files', file);
            setFormDataPhoto(formDataFile);
        } else {
            // Обработка ошибок
            if (!isValidSize) {
                setError('Слишком большой файл');
                setBlob(null);
            }
    
            if (!isValidResolution.isValidSize || !isValidResolution.isAspectRatioValid) {
                setError(isValidResolution.errors.join(', ')); // Устанавливаем ошибки в состояние
            }
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
                    Выбрать фото
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