import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { useState } from 'react'

interface Props {
    selectedCourse: any
    setSelectedCourse: any
}

export default function InputCourse({selectedCourse, setSelectedCourse}: Props) {
    const [displayedCourse, setDisplayedCourse] = useState([])
    const course = [1, 2, 3, 4]

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        setSelectedCourse(selectedValue);
    };

    const handleChange = (event: any) => {
		setDisplayedCourse(event.target.value)
        setSelectedCourse(event.target.value)
	}

    return (
        // <div>
        //     <select required className="select select-bordered max-w-xs rounded-none w-full" value={selectedCourse} onChange={handleSelectChange}>
        //         <option disabled selected>Курс..</option>
        //         {course && course.map((value: any) => (
        //             <option key={value} value={value}>
        //                 {value}
        //             </option>
        //         ))}
        //     </select>
        // </div>
        <Box className="max-w-36 w-full max-lg:max-w-xs">
			<FormControl fullWidth>
				<InputLabel id='demo-simple-select-label'>Курс</InputLabel>
				<Select
					labelId='demo-simple-select-label'
					id='demo-simple-select'
                    value={displayedCourse}
					label='Курс'
					onChange={handleChange}
				>
                {course && course.map((value: any) => (
                    <MenuItem key={value} value={value}>{value}</MenuItem>
		        ))}    
				</Select>
			</FormControl>
		</Box>
    );
}