'use client'
import React, { useState, useEffect } from 'react';
import { fetcher } from '@/lib/api';


interface WorktypesProps {
    id: number;
    attributes: {
        name: string
    }
}

interface Props {
    selectedWorktype: any
    setSelectedWorktype: any
}


export default function InputWorktype({selectedWorktype, setSelectedWorktype}: Props) {
    
    const [worktypes, setWorktypes] = useState<WorktypesProps[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const specResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/worktypes`);
            setWorktypes(specResponse.data);
        };
        fetchData();
    }, []); 
    

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        setSelectedWorktype(selectedValue);
    };


    return (
        <div>
            <select className="select select-bordered max-w-xs rounded-none w-full" value={selectedWorktype} onChange={handleSelectChange}>
                <option disabled selected>Тип работы</option>
                {worktypes && worktypes.map((value: WorktypesProps) => (
                    <option key={value.id} value={value.id}>
                        {value.attributes.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
