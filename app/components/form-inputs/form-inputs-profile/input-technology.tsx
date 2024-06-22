'use client'
import React, { useState, useEffect } from 'react';
import { fetcher } from '@/lib/api';
import DropDownInput from '../dropdown-input';



interface TechnologiesProps {
    id: number;
    attributes: {
        name: string
    }
}


export default function InputTechnology() {
    const [technologies, setTechnologies] = useState<TechnologiesProps[]>([]);
    
    useEffect(() => {
        const fetchData = async () => {
            const techResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/technologies`);
            const techNames = techResponse.data.map((res: any) => res.attributes.name);
            setTechnologies(techNames);
        };
        fetchData();
    }, []); 

    return (
        <div>
            <DropDownInput values={technologies} placeholder="Технологии...."/>
        </div>
    );
}