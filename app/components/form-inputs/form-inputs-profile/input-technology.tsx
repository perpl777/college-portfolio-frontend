'use client'
import React, { useState, useEffect } from 'react';
import { fetcher } from '@/lib/api';

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';


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
    const [displayedTechnologies, setDisplayedTechnologies] = useState([]);
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
      
    const handleChange = (event: any) => {
        const {
            target: { value },
        } = event;
        setDisplayedTechnologies(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };
      
    return (
        <div>
            <FormControl className="max-w-xs w-full">
                <InputLabel className='' id="demo-multiple-checkbox-label">Технологии</InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={displayedTechnologies}
                    onChange={handleChange}
                    input={<OutlinedInput label="Технологии" />}
                    renderValue={(selected) => selected.join(', ')}
                >
                    {technologies.map((tech: TechnologiesProps) => (
                        <MenuItem key={tech.attributes.name} value={tech.attributes.name} onClick={() => handleCheckboxChange(tech.id)}>
                            <Checkbox color='default' checked={displayedTechnologies.indexOf(tech.attributes.name) > -1} />
                            <ListItemText primary={tech.attributes.name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
        
    // return (
    //     <div>
    //         <label htmlFor="technologyInput">
    //         <button onClick={handleTechnologyClick} 
    //             className='button-style text-gray-500 mb-3 border border-gray-300 px-7 py-2'>
    //             Технологии
    //         </button>
    //         </label>
    //         {showCheckboxes && (
    //             <ul className='space-y-1'>
    //                 {technologies.map((tech: TechnologiesProps) => (
    //                     <li key={tech.id}>
    //                         <input
    //                             type="checkbox"
    //                             className='checkbox checkbox-xs rounded-sm  tab-border-2 border-black mx-3'
    //                             checked={selectedTechnologies.includes(tech.id)}
    //                             onChange={() => handleCheckboxChange(tech.id)}
    //                             disabled={selectedTechnologies.length === 4 && !selectedTechnologies.includes(tech.id)}
    //                         />
    //                         <label className='text-gray-600'>{tech.attributes.name}</label>
    //                     </li>
    //                 ))}
    //             </ul>
    //         )}
    //     </div>
    // );
}