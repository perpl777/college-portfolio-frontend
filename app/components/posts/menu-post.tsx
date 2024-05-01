import React, { useState } from 'react';


interface Props {
    values: any;
    updateFilteredValues: (query: string) => void;
}

const MenuPosts = ({values, updateFilteredValues}: Props) => {

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
        menu: 'overflow-x-auto whitespace-nowrap max-md:p-1 max-[500px]:gap-10',
        button: 'max-[425px]:py-2 max-md:text-base max-md:underline-offset-[8px]',
    }

    return  (
        <div className={`flex py-7 gap-16 ${stylesAdaptive.menu}`}>
            {values && values.map((value: any, index: any) => (
                <button
                    key={index}
                    onClick={() => handleVaSelection(value, index)}
                    className={`text-left text-base text-black underline-offset-[22px] ${index === activeButton ? 'underline font-medium' : ''} ${stylesAdaptive.button}`}
                >
                    {value}
                </button>
            ))}
        </div>
    )
}

export default MenuPosts;
