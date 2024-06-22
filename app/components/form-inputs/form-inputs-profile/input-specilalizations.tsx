'use client'
import React, { useState, useEffect } from 'react';
import { fetcher } from '@/lib/api';
import DropDownInput from '../dropdown-input';



interface SpecializationsProps {
    id: number;
    attributes: {
        name: string
    }
}


export default function InputSpecializations() {
    const [specializations, setSpecializations] = useState<SpecializationsProps[]>([]);
    
    useEffect(() => {
        const fetchData = async () => {
            const specResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/specializations`);
            const specNames = specResponse.data.map((spec: any) => spec.attributes.name);
            setSpecializations(specNames);
        };
        fetchData();
    }, []); 

    return (
        <div>
            <DropDownInput values={specializations} placeholder="Специальность.."/>
        </div>
    );
}