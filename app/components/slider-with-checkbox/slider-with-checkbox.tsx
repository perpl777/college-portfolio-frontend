'use client'
import React, { useState } from 'react';
import Checkbox from './checkbox';


interface Props {
    values: any;
    setSelectedCategory: any;
    checkboxChecked: any;
    setCheckboxChecked: any;
}


const SliderWithCheckbox = ({values, setSelectedCategory, checkboxChecked, setCheckboxChecked }: Props) => {
    
    const [activeButton, setActiveButton] = useState<number>(-1);

    const handleCategoryClick = (index: number, value: string) => {
        if (checkboxChecked) {
            setCheckboxChecked(false);
        }
        setActiveButton(index);
        setSelectedCategory(value);
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCheckboxChecked(e.target.checked);
        if (e.target.checked) {
            setActiveButton(-1);
            setSelectedCategory();
        }
        else {
            setActiveButton(0);
            setSelectedCategory(values[0]);
        }
    };

    const stylesAdaptive = {
        menu: 'overflow-x-auto whitespace-nowrap',
        button: 'max-md:text-base',
    }

    return  (
        <div>
            <div className={`flex items-center space-x-7 ${stylesAdaptive.menu}`}>
                {values && values.map((value: any, index: any) => (
                    <button
                        onClick={() => handleCategoryClick(index, value)}
                        key={index}
                        className={`text-left text-lg text-black p-2 capitalize ${index === activeButton ? 'border-b-2 border-black' : ''} ${stylesAdaptive.button}`}
                    >
                        {value}
                    </button>
                ))}
                <Checkbox onChange={handleCheckboxChange} defaultChecked={checkboxChecked}/>
            </div>
        </div>
    )
}

export default SliderWithCheckbox;
