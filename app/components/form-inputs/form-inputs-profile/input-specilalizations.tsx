'use client'
import React, { useState, useEffect } from 'react'
import { fetcher } from '@/lib/api'

import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

interface SpecializationsProps {
	id: number
	attributes: {
		name: string
	}
}

interface Props {
	selectedSpecialization: any
	setSelectedSpecialization: any
}

export default function InputSpecializations({selectedSpecialization, setSelectedSpecialization}: Props) {
    const [displayedSpecialization, setDisplayedSpecialization] = useState(selectedSpecialization || '');
    const [specializations, setSpecializations] = useState<SpecializationsProps[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const specResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/specializations`);
            if (specResponse.data && specResponse.data.length > 0) {
                setSpecializations(specResponse.data);
                const defaultSpec = specResponse.data.find((spec: { id: any }) => spec.id === selectedSpecialization);
                if (defaultSpec) {
                    setDisplayedSpecialization(defaultSpec.attributes.name);
                }
            }
        };
        fetchData();
    }, [selectedSpecialization]);

    const handleSelectChange = (id: number, name: string) => {
        setSelectedSpecialization(id);
        setDisplayedSpecialization(name);
    };

    const handleChange = (event: any) => {
        const selectedName = event.target.value;
        const selectedSpec = specializations.find(spec => spec.attributes.name === selectedName);
        if (selectedSpec) {
            handleSelectChange(selectedSpec.id, selectedName);
        }
    };

	return (

		<Box className="max-w-xs w-full rounded-none">
			<FormControl fullWidth>
                <InputLabel id='demo-simple-select-label'>Специальность</InputLabel>
                <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={displayedSpecialization}
                    label='Специальность'
                    onChange={handleChange}
                >
                    {specializations && specializations.map((value: SpecializationsProps) => (
                        <MenuItem key={value.id} value={value.attributes.name}>
                            {value.attributes.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
		</Box>
	)
}
