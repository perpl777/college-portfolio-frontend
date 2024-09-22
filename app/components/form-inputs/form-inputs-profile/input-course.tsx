import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useEffect, useState } from 'react'

interface Props {
    selectedCourse: number | null;
    setSelectedCourse: (course: number) => void;
}

export default function InputCourse({ selectedCourse, setSelectedCourse }: Props) {
    const [displayedCourse, setDisplayedCourse] = useState<number | ''>('');
    const course = [1, 2, 3, 4];

    useEffect(() => {
        if (selectedCourse !== null && course.includes(selectedCourse)) {
            setDisplayedCourse(selectedCourse);
        }
    }, [course, selectedCourse]);

    const handleSelectChange = (event: SelectChangeEvent<number>) => {
        const selectedValue = event.target.value as number;
        setDisplayedCourse(selectedValue);
        setSelectedCourse(selectedValue);
    };


    return (
        <Box className="max-w-36 w-full max-lg:max-w-xs">
            <FormControl fullWidth>
                <InputLabel id='demo-simple-select-label'>Курс</InputLabel>
                <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={displayedCourse}
                    label='Курс'
                    onChange={handleSelectChange}
                >
                    {course.map((value) => (
                        <MenuItem key={value} value={value}>{value}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}