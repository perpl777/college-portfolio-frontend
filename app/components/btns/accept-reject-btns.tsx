import React from 'react'


interface Props {
    handleDelete: any;
    handlePublish: any;
}


const Buttons = ({ handleDelete, handlePublish }: Props) => {
    return (
        <div className="space-x-7">
            <button 
                className='w-11 h-11 rounded-sm bg-black text-white hover:bg-white hover:text-black hover:border hover:border-black'
                onClick={handleDelete}
            >
                x
            </button>
            <button 
                className='w-11 h-11 rounded-sm bg-black text-white hover:bg-white hover:text-black hover:border hover:border-black'
                onClick={handlePublish}
            >
                ✓
            </button>
        </div>
    )
}

export default Buttons