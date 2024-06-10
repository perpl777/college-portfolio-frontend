import React, { useState } from 'react';

const Tags = () => {
    const [activeButtons, setActiveButtons] = useState<Set<number>>(new Set());

    const handleClick = (index: number) => {
        const newActiveButtons = new Set(activeButtons);

        if (newActiveButtons.has(index)) {
            newActiveButtons.delete(index);
        } 
        else {
            newActiveButtons.add(index);
        }
        setActiveButtons(newActiveButtons);
    };

    return (
        <div className="flex gap-3 max-lg:flex-wrap">
            <button
                className={`border rounded-sm  border-gray-200 py-1 px-4 text-sm text-gray-800 transition-colors ${
                activeButtons.has(0) ? 'bg-sky-100 zzborder border-sky-100 ' : ''
                }`}
                onClick={() => handleClick(0)}
            >
                # веб-разработка
            </button>
            <button
                className={`border rounded-sm  border-gray-200 py-1 px-4 text-sm text-gray-800 transition-colors ${
                activeButtons.has(1) ? 'bg-lime-100zz border border-lime-100 ' : ''
                }`}
                onClick={() => handleClick(1)}
            >
                # стилизация фотографий
            </button>
            <button
                className={`border rounded-sm border-gray-200 py-1 px-4 text-sm text-gray-800 transition-colors ${
                activeButtons.has(2) ? 'bg-orange-1zz00 border border-orange-100 ' : ''
                }`}
                onClick={() => handleClick(2)}
            >
                # интерфейсы
            </button>
            <button
                className={`border rounded-sm  border-gray-200 py-1 px-4 text-sm text-gray-800 transition-colors ${
                activeButtons.has(3) ? 'bg-purple-1zz00 border border-purple-100 ' : ''
                }`}
                onClick={() => handleClick(3)}
            >
                # брендинг
            </button>
        </div>
    );
};

export default Tags;