'use client'
import React, { useEffect, useMemo, useState } from 'react';
import StatisticsChart from '@/app/components/statistics/chart';
import { fetcher } from "@/lib/api"
import Header from '../components/header';
import Filter from '../components/filter';
import { getFiltredStudents } from '../components/rating/rating';
import { Student } from '../components/interfaces/statistics'
import Table from '../components/students-table';

const StatisticsPage = () => {
    let [students, setStudents] = useState<Student[]>([]);
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

    //Получение данных из бд
    useEffect(() => {     
        const fetchData = async () => {       
            try {
                const responseStudents = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/students?populate=*`);
                setStudents(responseStudents.data);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        fetchData();   
    }, []);

    const getRatingStudents = (students: Student[]) => {
        return getFiltredStudents(students);
    }

    const filteredStudents = useMemo(() => {
        if (!students) return [];
        let filteredData = students;
        
        // Фильтрация по специальности
        if (filteredSpecialty) {
        filteredData = filteredData.filter(student => student.attributes.specialization.data.attributes.name === filteredSpecialty);
        }

        return getRatingStudents(filteredData);
    }, [students, filteredSpecialty]);


return (
    <>
        <Header />
        
        <div className='p-10 relative'>
            <div className="sm:absolute py-5 py-5 w-full flex sm:justify-start justify-end">
                <Filter values={specialty} updateFilteredValues={setFilteredSpecialty} type={'rounden-lg'}/>
            </div>
            {students ? (
                <div className="">
                    <StatisticsChart students={filteredStudents} />
                    <div className='py-10'>
                        <Table students={filteredStudents} studentLinks={{ href: "portfolio" }} type={'all'}/>
                    </div>
                </div>

            ) : (
                <p>Loading...</p>
            )}
        </div>
    </>
);
};

export default StatisticsPage;