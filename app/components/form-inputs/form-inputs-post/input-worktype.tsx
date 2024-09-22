'use client'
import React, { useState, useEffect } from 'react';
import { fetcher } from '@/lib/api';

import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

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

export default function InputWorktype({ selectedWorktype, setSelectedWorktype }: Props) {
    const [displayedWorktype, setDisplayedWorktype] = useState<string>(selectedWorktype);
    const [worktypes, setWorktypes] = useState<WorktypesProps[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const specResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/worktypes`);
            setWorktypes(specResponse.data);
            // Ensure the displayedWorktype is set initially based on the fetched worktypes
            if (selectedWorktype) {
                const initialWorktype = specResponse.data.find((w: WorktypesProps) => w.id === selectedWorktype);
                setDisplayedWorktype(initialWorktype ? initialWorktype.attributes.name : "");
            }
        };
        fetchData();
    }, [selectedWorktype]);

    const handleSelectChange = (id: number, name: string) => {
        setSelectedWorktype(id);
        setDisplayedWorktype(name);
    }
    
    const handleChange = (event: SelectChangeEvent<string>) => {
        const selectedName = event.target.value as string;
        const selectedWorktypeObj = worktypes.find(w => w.attributes.name === selectedName);
        if (selectedWorktypeObj) {
            handleSelectChange(selectedWorktypeObj.id, selectedName);
        }
    }

    return (
        <Box className="max-w-xs w-full rounded-none">
            <FormControl fullWidth>
                <InputLabel id='demo-simple-select-label'>Тип работы</InputLabel>
                <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={displayedWorktype}
                    label='Тип работы'
                    onChange={handleChange}
                >
                    {worktypes.map((value: WorktypesProps) => (
                        <MenuItem key={value.id} value={value.attributes.name}>
                            {value.attributes.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}
