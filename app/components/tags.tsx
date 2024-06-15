import React, { useState } from 'react';


const Tags = ({ tags }: any) => {
    const [activeButtons, setActiveButtons] = useState<Set<number>>(new Set());

    const handleClick = (index: number) => {
        const newActiveButtons = new Set(activeButtons);
        if (newActiveButtons.has(index)) {
            newActiveButtons.delete(index);
        } else {
            newActiveButtons.add(index);
        }
        setActiveButtons(newActiveButtons);
    };

    return (
        <div className="flex gap-4 max-lg:flex-wrap">
            {tags && tags.data?.map((tag: any, index: number) => {
                return (
                    <button
                        key={index}
                        className={`border rounded-sm border-gray-200 py-1 px-3 text-sm text-gray-800  transition-colors ${
                            activeButtons.has(index) ? 'bg-gray-200 border border-opacity-0' : ''
                        }`}
                        onClick={() => handleClick(index)}
                    >
                        # {tag.attributes.name}
                    </button>
                )
            })}
        </div>
    );
};

export default Tags;