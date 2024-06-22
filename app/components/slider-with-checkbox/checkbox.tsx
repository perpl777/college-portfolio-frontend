import React from 'react'


const Checkbox = ({ onChange, checked }: any) => {
    return (
        <div className="form-control">
            <label className="cursor-pointer label gap-2 p-0">
                <input type="checkbox" 
                    className="checkbox checkbox-xs rounded-sm tab-border-2 border-black"
                    onClick={onChange} 
                    checked={checked}
                    />
                <span className="label-text text-base">Все</span>
            </label>
        </div>
    )
}

export default Checkbox