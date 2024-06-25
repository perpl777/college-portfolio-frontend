'use client'
import React, { useState } from 'react'


interface InputTextProps {
  placeholder: string;
  value: any;
  disabled: boolean;
}

//для страницы редактрования студента. можно потом удалить форму и сделать как в добавлении
const InputText: React.FC<InputTextProps> = ({ placeholder, value, disabled }) => {
  const [inputValue, setInputValue] = useState(value);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value); 
  };

  return (
    <>
      <label className="my-5 border-b border-gray-500 flex gap-2 items-center w-full">
        <input type="text" className="grow outline-none p-2 w-full" placeholder={placeholder} value={inputValue} onChange={handleChange}/>
    </label>
    </>
  )
}

export default InputText