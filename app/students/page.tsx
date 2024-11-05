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

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';


interface StudentProps {
    data: Student[];
}


export default function StudentsPage() {
    const itemsPerPage = 30;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    
    const [students, setStudents] = useState<StudentProps>();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredSpecialty, setFilteredSpecialty] = useState<string | null>(null);

    const [loading, setLoading] = useState<boolean>(false);

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

    // Обновляем данные при изменении фильтров, поискового запроса или текущей страницы
    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true)
    
            const start = (currentPage - 1) * itemsPerPage;
            let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/students?filters[published][$eq]=true&populate=*&pagination[start]=${start}&pagination[limit]=${itemsPerPage}`;
    
            // Добавляем фильтр по специальности, если он выбран
            if (filteredSpecialty && filteredSpecialty !== "Все специальности") {
                url += `&filters[convergence][full_name][$eq]=${filteredSpecialty}`;
            }
    
            // Добавляем поисковый запрос
            if (searchQuery) {
                url += `&filters[$or][0][surname][$containsi]=${searchQuery}&filters[$or][1][name][$containsi]=${searchQuery}`;
            }
    
            const response = await fetcher(url);
            setStudents(response);
    
            // Обновление общего количества страниц
            const totalItems = response.meta.pagination.total;
            setTotalPages(Math.ceil(totalItems / itemsPerPage));
    
            setLoading(false)
        };
        fetchStudents();
    }, [currentPage, filteredSpecialty, searchQuery]);

    // Сброс текущей страницы при изменении фильтров или поискового запроса
    useEffect(() => {
        setCurrentPage(1);
    }, [filteredSpecialty, searchQuery]);

    const handlePagination = (event: React.ChangeEvent<unknown>, page: number) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setCurrentPage(page);
    }

    // локальная фильтрация по рейтингу
    const filteredStudents = useMemo(() => {
        if (!students) return []
        return getFiltredStudents(students.data)
    }, [students])


    return (
        <div>
            <Header />

            <div className="flex justify-between px-11 pt-24 pb-12 flex-wrap gap-10 lg:flex-nowrap max-sm:p-4 max-sm:pt-16 max-sm:pb-2">
                <Search setSearchQuery={setSearchQuery} placeholder='Найти студента' />
                <Filter values={specialty} updateFilteredValues={setFilteredSpecialty} type={'rounden-lg'}/>
            </div>

            {loading ? ( 
                <Loading />
            ) : (
                <div className='px-11 max-sm:p-6'>
                    <Table students={filteredStudents} studentLinks={{ href: "portfolio" }} startIndex={(currentPage-1)*itemsPerPage}/>
                </div> 
            )}

            {/* Pagination Controls */}
            <div className="flex justify-center mt-10 mb-20 space-x-2">
                <Stack spacing={2}>
                    <Pagination 
                        count={totalPages} 
                        shape="rounded" 
                        size='large' 
                        page={currentPage} 
                        onChange={handlePagination}
                    />
                </Stack>
            </div>
        </div>
    );
}


