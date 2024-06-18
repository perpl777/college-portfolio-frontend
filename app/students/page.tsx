'use client'
import React, { Suspense, useEffect, useState, useMemo } from 'react'
import { fetcher } from "../../lib/api"

import Loading from '../loading'

import Search from '../components/search'
import Filter from '../components/filter'
import Table from '../components/students-table';
import Header from '../components/header'


interface DataStudents {
    id: number;
    attributes: {
        surname: string;
        name: string;
        patronymic: string;
        specialization: {
            data: {
                attributes: {
                    name: string
                }
            }
        }
    };
}

interface StudentProps {
    data: DataStudents[]
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
        "Коммерческий дизайн", 
        "Фотография",
        "Печатное дело", 
        "Издательское дело",
        "Издательское дело и реклама",
        "Изделия из бумаги и картона", 
    ]

    //фетч
    useEffect(() => {     
        const fetchData = async () => {       
        const studentsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/students?populate=specialization&fields=name&fields=surname&fields=patronymic`);
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
        filteredData = filteredData.filter(student => student.attributes.specialization.data.attributes.name === filteredSpecialty);
        }

        // Поиск по запросу
        if (searchQuery) {
        const searchResults = filteredData.filter(student => 
            student.attributes.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.attributes.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        filteredData = searchResults;
        }
        
        return filteredData;
    }, [students, filteredSpecialty, searchQuery]);


    return (
        <div>
            <Header />

            <div className="flex justify-between px-11 pt-24 pb-10 flex-wrap gap-10 lg:flex-nowrap max-sm:p-6 max-sm:pt-16 max-sm:pb-2">
                <Search setSearchQuery={setSearchQuery} />
                <Filter values={specialty} updateFilteredValues={setFilteredSpecialty} type={'rounden-lg'}/>
            </div>

            <div className='px-11 max-sm:p-6'>
                <Suspense fallback={<Loading />}>
                    <Table students={filteredStudents} studentLinks={{ href: "portfolio" }} type={'all'}/>
                </Suspense>
            </div> 
        </div>
    );
}