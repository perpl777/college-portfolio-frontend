'use client'
import React from 'react'
import { useState } from 'react'


const Checkbox = ({ updateFilteredCourse }: any) => {
    const [showHigherCourse, setShowHigherCourse] = useState(false);

    const handleCheckboxChange = () => {
        setShowHigherCourse(!showHigherCourse);
        updateFilteredCourse(showHigherCourse ? null : [3, 4]);
    };

    return (
        <div className="form-control">
            <label className="cursor-pointer label gap-2 p-0">
                <input type="checkbox" 
                    className="checkbox checkbox-xs rounded-sm tab-border-2 border-black"
                    checked={showHigherCourse}
                    onChange={handleCheckboxChange} />
                <span className="label-text text-base">Выпускники</span>
            </label>
        </div>
    )
}

export default Checkbox