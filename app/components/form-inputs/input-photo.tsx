'use client'
import { useState } from 'react';
import Image from "next/image";
import Plus from '@/public/plus.svg'



export default function InputPhoto() {

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event: any) => {
        setSelectedFile(event.target.files[0]);
    };

    return (
        <button className='flex items-center justify-center w-full h-full border border-gray-400 hover:bg-zinc-50'>
            {/* <input type="file" style={{ display: 'none' }} required onChange={handleFileChange} />
            <div className="absolute">
                <Image src={Plus} alt="add photo" className='m-auto'/>
                <p className="text-gray-400 text-base pt-5">Добавить фото</p>
            </div> */}
        </button>
    );
}