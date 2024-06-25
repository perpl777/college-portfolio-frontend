import React from 'react'


interface TextBtnProps {
    text: string;
}


const ButtonStroke: React.FC<TextBtnProps> = ({ text }) => {
  return (
    <button 
          type='submit'
          className="
            w-48 
            bg-white
            h-11 
            border 
            rounded-[4px] 
            border-gray-500 
            font-semibold 
            text-base 
            text-black 
            hover:bg-black 
            hover:text-white 
            transition-all">
            {text}
    </button>
  )
}

export default ButtonStroke