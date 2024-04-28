'use client'

import React from 'react'
import Image from 'next/image'
import search from '@/public/bx-search 1.svg'


interface Props {
    setSearchQuery: (query: string) => void;
}

const Search = ({ setSearchQuery }: Props) => {
    return (
        <div>
            <label className="border-b border-black flex gap-2 items-center w-64">
                <Image src={search} className="ml-2" alt='title'/>
                <input 
                    type="text" 
                    className="grow outline-none p-2" 
                    placeholder="Найти студента" 
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </label>
        </div>
    )
}

export default Search