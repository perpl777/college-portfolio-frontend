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

interface TagsProps {
    id: number;
    attributes: {
        name: string;
    };
}

interface Props {
    selectedTags: any
    setSelectedTags: any
}

export default function InputTags({selectedTags, setSelectedTags}: Props) {
    const [tags, setTags] = useState<TagsProps[]>([]);
    const [displayedTags, setDisplayedTags] = useState([]);
    const [showCheckboxes, setShowCheckboxes] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const tagsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/tags`);
            setTags(tagsResponse.data);
        };
        fetchData();
    }, []);

    const handleCheckboxChange = (id: number) => {
        if (selectedTags.includes(id)) {
            setSelectedTags((prevSelected: any) => prevSelected.filter((tagsId: any) => tagsId !== id));
        } else {
            if (selectedTags.length < 4) {
                setSelectedTags((prevSelected: any) => [...prevSelected, id]);
            }
        }
    };

    const handleTagsClick = (e: any) => {
        e.preventDefault();
        setShowCheckboxes(!showCheckboxes);
    };

    const handleChange = (event: any) => {
        const {
            target: { value },
        } = event;
        setDisplayedTags(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        // <div>
        //     <label htmlFor="technologyInput">
        //     <button onClick={handleTagsClick} 
        //         className='button-style text-gray-500 mb-3 border border-gray-300 px-7 py-2'>
        //         Тэги
        //     </button>
        //     </label>
        //     {showCheckboxes && (
        //         <ul className='space-y-1'>
        //             {tags.map((tag: TagsProps) => (
        //                 <li key={tag.id}>
        //                     <input
        //                         type="checkbox"
        //                         className='checkbox checkbox-xs rounded-sm  tab-border-2 border-black mx-3'
        //                         checked={selectedTags.includes(tag.id)}
        //                         onChange={() => handleCheckboxChange(tag.id)}
        //                         disabled={selectedTags.length === 4 && !selectedTags.includes(tag.id)}
        //                     />
        //                     <label className='text-gray-600'>#{tag.attributes.name}</label>
        //                 </li>
        //             ))}
        //         </ul>
        //     )}
        // </div>
        <div>
        <FormControl className="max-w-xs w-full">
            <InputLabel className='' id="demo-multiple-checkbox-label">Теги</InputLabel>
            <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={displayedTags}
                onChange={handleChange}
                input={<OutlinedInput label="Теги" />}
                renderValue={(selected) => selected.join(', ')}
            >
                {tags.map((tag: TagsProps) => (
                    <MenuItem key={tag.attributes.name} value={tag.attributes.name} onClick={() => handleCheckboxChange(tag.id)}>
                        <Checkbox checked={displayedTags.indexOf(tag.attributes.name) > -1} />
                        <ListItemText primary={tag.attributes.name} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    </div>
    );
}