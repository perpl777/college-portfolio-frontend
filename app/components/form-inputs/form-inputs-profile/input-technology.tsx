'use client'
import React, { useState, useEffect } from 'react';
import { fetcher } from '@/lib/api';


interface TechnologiesProps {
    id: number;
    attributes: {
        name: string;
    };
}

interface Props {
    selectedTechnologies: any
    setSelectedTechnologies: any
}


export default function InputTechnology({selectedTechnologies, setSelectedTechnologies}: Props) {
    const [technologies, setTechnologies] = useState<TechnologiesProps[]>([]);
    const [showCheckboxes, setShowCheckboxes] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const techResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/technologies`);
            setTechnologies(techResponse.data);
        };
        fetchData();
    }, []);


    const handleCheckboxChange = (id: number) => {
        if (selectedTechnologies.includes(id)) {
            setSelectedTechnologies((prevSelected: any) => prevSelected.filter((techId: any) => techId !== id));
        } else {
            if (selectedTechnologies.length < 4) {
                setSelectedTechnologies((prevSelected: any) => [...prevSelected, id]);
            }
        }
    };

    const handleTechnologyClick = (e: any) => {
        e.preventDefault();
        setShowCheckboxes(!showCheckboxes);
    };

    return (
        <div>
            <label htmlFor="technologyInput">
            <button onClick={handleTechnologyClick} 
                className='button-style text-gray-500 mb-3 border border-gray-300 px-7 py-2'>
                Технологии
            </button>
            </label>
            {showCheckboxes && (
                <ul className='space-y-1'>
                    {technologies.map((tech: TechnologiesProps) => (
                        <li key={tech.id}>
                            <input
                                type="checkbox"
                                className='checkbox checkbox-xs rounded-sm  tab-border-2 border-black mx-3'
                                checked={selectedTechnologies.includes(tech.id)}
                                onChange={() => handleCheckboxChange(tech.id)}
                                disabled={selectedTechnologies.length === 4 && !selectedTechnologies.includes(tech.id)}
                            />
                            <label className='text-gray-600'>{tech.attributes.name}</label>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}