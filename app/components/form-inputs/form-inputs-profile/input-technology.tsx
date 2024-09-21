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


export default function InputTechnology({ selectedTechnologies, setSelectedTechnologies }: Props) {
    const [technologies, setTechnologies] = useState<TechnologiesProps[]>([]);
    const [displayedTechnologies, setDisplayedTechnologies] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const techResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/technologies`);
            setTechnologies(techResponse.data);

            // После получения данных, установка displayedTechnologies на основе selectedTechnologies
            const selectedTechNames = techResponse.data
                .filter((tech: TechnologiesProps) => selectedTechnologies.includes(tech.id))
                .map((tech: TechnologiesProps) => tech.attributes.name);

            setDisplayedTechnologies(selectedTechNames);
        };
        fetchData();
    }, [selectedTechnologies]);

    const handleCheckboxChange = (id: number | string) => {
        if (selectedTechnologies.includes(id)) {
            setSelectedTechnologies((prevSelected: number[] | string[]) => prevSelected.filter((techId) => techId !== id));
        } else {
            if (selectedTechnologies.length < 4) {
                setSelectedTechnologies((prevSelected: number[] | string[]) => [...prevSelected, id]);
            }
        }
    };

    const handleChange = (event: any) => {
        const {
            target: { value },
        } = event;
        setDisplayedTechnologies(
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
                    renderValue={(selected: string[]) => selected.join(', ')}
                >
                    {technologies.map((tech: TechnologiesProps) => (
                        <MenuItem key={tech.attributes.name} value={tech.attributes.name} onClick={() => handleCheckboxChange(tech.id)}>
                            <Checkbox checked={displayedTechnologies.includes(tech.attributes.name)} />
                            <ListItemText primary={tech.attributes.name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}
