'use client'
import React, { useState } from 'react';
import Checkbox from '../components/checkbox';


interface Props {
    values: any;
    updateFilteredValues: (query: string) => void;
}


const SliderMenu = ({values, updateFilteredValues}: Props) => {

    const [selectedValues, setSelectedValues] = useState(null);
    const [activeButton, setActiveButton] = useState(0);

    const handleVaSelection = (Values: any, index: any) => {
        if (Values === values[0]) {
            setSelectedValues(null); 
            updateFilteredValues("");
        } else {
            setSelectedValues(Values);
            updateFilteredValues(Values);
        }
        setActiveButton(index);
    };

    const stylesAdaptive = {
        menu: 'overflow-x-auto whitespace-nowrap',
        button: 'max-md:text-base',
    }

    return  (
        <div className={`flex items-center space-x-10  ${stylesAdaptive.menu}`}>
            {values && values.map((value: any, index: any) => (
                <button
                    key={index}
                    onClick={() => handleVaSelection(value, index)}
                    className={`text-left text-lg text-black p-1 ${index === activeButton ? 'border-b-2 border-black' : ''} ${stylesAdaptive.button}`}
                >
                    {value}
                </button>
            ))}
            <Checkbox/>
        </div>
    )
}

export default SliderMenu;
