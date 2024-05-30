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
        <div className="flex gap-2">
        <button
            className={`border border-gray-400 py-1 px-6 text-sm text-black transition-colors ${
            activeButtons.has(0) ? 'bg-sky-100 border-sky-100' : ''
            }`}
            onClick={() => handleClick(0)}
        >
            # веб-разработка
        </button>
        <button
            className={`border border-gray-400 py-1 px-6 text-sm text-black transition-colors ${
            activeButtons.has(1) ? 'bg-lime-100 border-lime-100' : ''
            }`}
            onClick={() => handleClick(1)}
        >
            # стилизация фотографий
        </button>
        <button
            className={`border border-gray-400 py-1 px-6 text-sm text-black transition-colors ${
            activeButtons.has(2) ? 'bg-orange-100 border-orange-100' : ''
            }`}
            onClick={() => handleClick(2)}
        >
            # интерфейсы
        </button>
        <button
            className={`border border-gray-400 py-1 px-6 text-sm text-black transition-colors ${
            activeButtons.has(3) ? 'bg-purple-100 border-purple-100' : ''
            }`}
            onClick={() => handleClick(3)}
        >
            # брендинг
        </button>
        </div>
    );
};

export default Tags;