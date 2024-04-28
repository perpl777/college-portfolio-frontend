import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import Image from 'next/image';

interface InputPhotoProps {
  value: string;
}

//для страницы редактрования студента. можно потом удалить форму и сделать как в добавлении
export default function InputPhoto({ value }: InputPhotoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<Blob | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (value) {
        const response = await fetch(`http://localhost:1337${value}`);
        const fetchedBlob = await response.blob();
        setBlob(fetchedBlob);
      }
    };

    fetchData();
  }, []);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setBlob(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`flex items-center justify-center w-full border border-gray-500 ml-5 mb-5`} style={{ minHeight: '300px' }}>
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