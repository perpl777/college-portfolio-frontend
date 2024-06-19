'use client'
import React, { useState } from 'react'


interface InputProps {
  placeholder: string;
  value: string;
}

//для страницы редактрования студента. можно потом удалить форму и сделать как в добавлении
const Textarea: React.FC<InputProps> = ({ placeholder, value }) => {
  const [inputValue, setTextValue] = useState(value);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(e.target.value);
  };

  return (
    <>
      <label className="my-5 border border-gray-500 flex gap-2 items-center  w-full">
        <textarea 
            className="grow outline-none px-5 pt-5 rounded-sm" 
            placeholder={placeholder} 
            value={inputValue}
            onChange={handleChange}
            style={{ whiteSpace: "nowrap", overflow: "hidden" }}
        />
    </label>
    </>
  )
}

export default Textarea

function setTextValue(value: string) {
  throw new Error('Function not implemented.');
}
