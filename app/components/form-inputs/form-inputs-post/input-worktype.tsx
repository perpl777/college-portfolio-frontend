'use client'
import React, { useState, useEffect } from 'react';
import { fetcher } from '@/lib/api';

import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

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
    const [displayedWorktype, setDisplayedWorktype] = useState([])
    const [worktypes, setWorktypes] = useState<WorktypesProps[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const specResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/worktypes`);
            setWorktypes(specResponse.data);
        };
        fetchData();
    }, []); 
    

    // const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     const selectedValue = e.target.value;
    //     setSelectedWorktype(selectedValue);
    // };

    const handleSelectChange = (id: number) => {
        setSelectedWorktype(id)
    }

    const handleChange = (event: any) => {
        setDisplayedWorktype(event.target.value)
    }

    return (
        // <div>
        //     <select className="select select-bordered max-w-xs rounded-none w-full" value={selectedWorktype} onChange={handleSelectChange}>
        //         <option disabled selected>Тип работы</option>
        //         {worktypes && worktypes.map((value: WorktypesProps) => (
        //             <option key={value.id} value={value.id}>
        //                 {value.attributes.name}
        //             </option>
        //         ))}
        //     </select>
        // </div>
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
                {worktypes && worktypes.map((value: WorktypesProps) => (
                    <MenuItem key={value.id} value={value.attributes.name} onClick={() => handleSelectChange(value.id)}>{value.attributes.name}</MenuItem>
		        ))}    
				</Select>
			</FormControl>
		</Box>
    );
}
