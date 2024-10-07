'use client'
import React, { useState, useEffect } from 'react'
import { fetcher } from '@/lib/api'

import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

interface convergenceProps {
	id: number
	attributes: {
		name: string
	}
}

interface Props {
	selectedConvergence: any
	setSelectedConvergence: any
}

export default function InputConvergence({selectedConvergence, setSelectedConvergence}: Props) {
    const [displayedConvergence, setDisplayedConvergence] = useState(selectedConvergence || '');
    const [convergence, setConvergence] = useState<convergenceProps[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const convResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/convergences?pagination[start]=0&pagination[limit]=50`);
            if (convResponse.data && convResponse.data.length > 0) {
                setConvergence(convResponse.data);
                const defaultSpec = convResponse.data.find((spec: { id: any }) => spec.id === selectedConvergence);
                if (defaultSpec) {
                    setDisplayedConvergence(defaultSpec.attributes.name);
                }
            }
        };
        fetchData();
    }, [selectedConvergence]);

    const handleSelectChange = (id: number, name: string) => {
        setSelectedConvergence(id);
        setDisplayedConvergence(name);
    };

    const handleChange = (event: any) => {
        const selectedName = event.target.value;
        const selectedConv = convergence.find(spec => spec.attributes.name === selectedName);
        if (selectedConv) {
            handleSelectChange(selectedConv.id, selectedName);
        }
    };

	return (

		<Box className="max-w-xs w-full rounded-none">
			<FormControl fullWidth>
                <InputLabel id='demo-simple-select-label'>Группа</InputLabel>
                <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={displayedConvergence}
                    label='Группа'
                    onChange={handleChange}
                >
                    {convergence && convergence.map((value: convergenceProps) => (
                        <MenuItem key={value.id} value={value.attributes.name}>
                            {value.attributes.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
		</Box>
	)
}
