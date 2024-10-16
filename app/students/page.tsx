'use client'
import React, { Suspense, useEffect, useState, useMemo } from 'react'
import { fetcher } from "../../lib/api"

import Loading from '../loading'

import Search from '../components/search'
import Filter from '../components/filter'
import Table from '../components/students/students-table';
import Header from '../components/header'
import { getFiltredStudents } from '../components/rating/rating';
import { Student } from '../components/interfaces/statistics'


interface StudentProps {
    data: Student[];
}


export default function StudentsPage() {
    
    let [students, setStudents] = useState<StudentProps>();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredSpecialty, setFilteredSpecialty] = useState<string | null>(null);

    const specialty = [
        "Все специальности",
        "Информационные системы и программирование", 
        "Реклама", 
        "Дизайн", 
        "Графический дизайн", 
        "Документационное обеспечение", 
        "Полиграфическое производство",
        "Печатное дело", 
        "Издательское дело",
        "Издательское дело и реклама",
        "Производство изделий из бумаги и картона", 
    ]
    
    //фетч
    useEffect(() => {     
        const fetchData = async () => {       
            const studentsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/students?filters[published][$eq]=true&populate=*&pagination[start]=0&pagination[limit]=2000`);
            setStudents(studentsResponse);
        };
        fetchData();   
    }, []);


    //фильтр для студентов
    const filteredStudents = useMemo(() => {
        if (!students) return [];
        let filteredData = students.data;
        
        // Фильтрация по специальности
        if (filteredSpecialty) {
        filteredData = filteredData.filter(student => student.attributes.convergence?.data.attributes.full_name === filteredSpecialty);
        }

        // Поиск по запросу
        if (searchQuery) {
        const searchResults = filteredData.filter(student => 
            student.attributes.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.attributes.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        filteredData = searchResults;
        }

        return getFiltredStudents(filteredData);
    }, [students, filteredSpecialty, searchQuery]);


    return (
        <div>
            <Header />

            <div className="flex justify-between px-11 pt-24 pb-12 flex-wrap gap-10 lg:flex-nowrap max-sm:p-4 max-sm:pt-16 max-sm:pb-2">
                <Search setSearchQuery={setSearchQuery} placeholder='Найти студента' />
                <Filter values={specialty} updateFilteredValues={setFilteredSpecialty} type={'rounden-lg'}/>
            </div>

            <div className='px-11 max-sm:p-6'>
                <Suspense fallback={<Loading />}>
                    <Table students={filteredStudents} studentLinks={{ href: "portfolio" }}/>
                </Suspense>
            </div> 
        </div>
    );
}


