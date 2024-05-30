'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';


interface DataPost {
    photo?: string
}

const ImagePost = ({photo}: DataPost) => {

    const [blob, setBlob] = useState<Blob | null>(null);

    useEffect(() => {
        const fetchPhoto = () => {
            if (photo) {
                const response = fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL_UPLOAD}${photo}`);
                response.then(resp => resp.blob())
                    .then(fetchedBlob => setBlob(fetchedBlob));
            }
        };
    
        fetchPhoto();
    }, [photo]);

    return (
        <Image
            src={blob ? URL.createObjectURL(blob) : ''}
            alt="image" 
            quality={80}
            width={440}
            height={350}
            style={{ objectFit: 'cover', width: '440px', height: '350px' }}
        />
    )
}

export default ImagePost