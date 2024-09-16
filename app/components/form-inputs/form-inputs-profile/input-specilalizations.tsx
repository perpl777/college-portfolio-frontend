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

export default function InputSpecializations({
	selectedSpecialization,
	setSelectedSpecialization,
}: Props) {
	const [specializations, setSpecializations] = useState<
		SpecializationsProps[]
	>([])

	useEffect(() => {
		const fetchData = async () => {
			const specResponse = await fetcher(
				`${process.env.NEXT_PUBLIC_STRAPI_URL}/specializations`
			)
			setSpecializations(specResponse.data)
		}
		fetchData()
	}, [])

	const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedValue = e.target.value
		setSelectedSpecialization(selectedValue)
	}

	const handleChange = (event: any) => {
		setSelectedSpecialization(event.target.value)
	}

	return (
		// <div>
		//     <select className="select select-bordered max-w-xs rounded-none w-full outline-none" value={selectedSpecialization} onChange={handleSelectChange}>
		//         <option disabled selected>Специальность..</option>
		//         {specializations && specializations.map((value: SpecializationsProps) => (
		//             <option key={value.id} value={value.id}>
		//                 {value.attributes.name}
		//             </option>
		//         ))}
		//     </select>
		// </div>
		<Box className="max-w-xs w-full rounded-none">
			<FormControl fullWidth>
				<InputLabel id='demo-simple-select-label'>Специальность</InputLabel>
				<Select
					labelId='demo-simple-select-label'
					id='demo-simple-select'
					value={selectedSpecialization}
					label='Специальность'
					onChange={handleChange}
				>
                {specializations && specializations.map((value: SpecializationsProps) => (
                    <MenuItem key={value.id} value={value.id}>{value.attributes.name}</MenuItem>
		        ))}    
				</Select>
			</FormControl>
		</Box>
	)
}
