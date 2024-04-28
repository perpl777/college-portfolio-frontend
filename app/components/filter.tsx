/* eslint-disable react/jsx-key */
'use client'

import React, { useState } from 'react'
import Arrow from '@/public/bx-chevron-down 1.svg'
import Image from 'next/image'

type type = "rounden-lg" | "none"
interface Props {
    values: any;
    updateFilteredValues: (query: string) => void;
    type: type;
}


const Filter = ({values, updateFilteredValues, type}: Props) => {

    const [selectedValues, setSelectedValues] = useState(null);

    const handleVaSelection = (Values: any) => {
        if (Values === values[0]) {
            setSelectedValues(null); 
            updateFilteredValues("");
        } else {
            setSelectedValues(Values);
            updateFilteredValues(Values);
        }
    };

    return (
        <div className="dropdown grid-cols-1 sm:grid-cols-3">
            {type == "none" 
            ?
            <>
                <summary 
                    tabIndex={0} 
                    role="button" 
                    className={`flex pl-3 py-2 gap-1 w-64 border border-gray-500 bg-white`}
                >
                    <Image src={Arrow} alt='arrow' />
                    <span className='truncate w-full inline-block'> {selectedValues || values[0]} </span>
                </summary>

                <ul tabIndex={0} className={`dropdown-content z-[1] menu bg-white border border-gray-100 text-base mt-1`}>
                    {values.map((value: any, index: any) => (
                        <li key={index} onClick={() => handleVaSelection(value)}>
                            <a> {value} </a>
                        </li>
                    ))}
                </ul>
            </>
            :
            <>
                <summary 
                    tabIndex={0} 
                    role="button" 
                    className={`flex pl-3 py-2 gap-1 w-64 border border-gray-800 bg-white rounded-lg`}
                >
                    <Image src={Arrow} alt='arrow' />
                    <span className='truncate w-full inline-block'> {selectedValues || values[0]} </span>
                </summary>

                <ul tabIndex={0} className={`dropdown-content z-[1] menu bg-white border rounded-lg border-gray-100 text-base mt-1`}>
                    {values.map((value: any, index: any) => (
                        <li key={index} onClick={() => handleVaSelection(value)}>
                            <a> {value} </a>
                        </li>
                    ))}
                </ul>
            </>
            }
            
        </div>
    )
}

export default Filter