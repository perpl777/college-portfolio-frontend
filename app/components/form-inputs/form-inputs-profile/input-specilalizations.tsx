'use client'
import React, { useState, useEffect } from 'react';
import { fetcher } from '@/lib/api';



interface SpecializationsProps {
    id: number;
    attributes: {
        name: string
    }
}

interface Props {
    selectedSpecialization: any
    setSelectedSpecialization: any
}


export default function InputSpecializations({selectedSpecialization, setSelectedSpecialization}: Props) {
    

    const [specializations, setSpecializations] = useState<SpecializationsProps[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            const specResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/specializations`);
            setSpecializations(specResponse.data);
        };
        fetchData();
    }, []); 
    

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        setSelectedSpecialization(selectedValue);
    };


    return (
        <div>
            <select className="select select-bordered max-w-xs rounded-none w-full" value={selectedSpecialization} onChange={handleSelectChange}>
                <option disabled selected>Специальность..</option>
                {specializations && specializations.map((value: SpecializationsProps) => (
                    <option key={value.id} value={value.id}>
                        {value.attributes.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
