'use client'
import React, { useState, useEffect } from 'react';
import { fetcher } from '@/lib/api';

import { FormControl, InputLabel, Select, MenuItem, Checkbox, OutlinedInput, ListItemText } from '@mui/material';

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
    const [displayedTags, setDisplayedTags] = useState<string[]>(selectedTags);

    useEffect(() => {
        const fetchData = async () => {
            const tagsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/tags?pagination[start]=0&pagination[limit]=100`);
            setTags(tagsResponse.data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        // Обновляем displayedTags при изменении selectedTags
        const initialDisplayedTags = tags
            .filter(tag => selectedTags.includes(tag.id))
            .map(tag => tag.attributes.name);
        setDisplayedTags(initialDisplayedTags);
    }, [selectedTags, tags]);

    const handleCheckboxChange = (id: number) => {
        if (selectedTags.includes(id)) {
            setSelectedTags((prevSelected: any[]) => prevSelected.filter((tagsId) => tagsId !== id));
        } else {
            if (selectedTags.length < 4) {
                setSelectedTags((prevSelected: any) => [...prevSelected, id]);
            }
        }
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
                    <MenuItem 
                        key={tag.id}
                        value={tag.attributes.name} 
                        onClick={() => handleCheckboxChange(tag.id)}
                    >
                        <Checkbox defaultChecked={displayedTags.indexOf(tag.attributes.name) > -1} />
                        <ListItemText primary={tag.attributes.name} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    </div>
    );
}