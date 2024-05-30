'use client'
import React, { Suspense, useEffect, useState, useMemo } from 'react'
import { fetcher } from "../lib/api"
import Loading from './loading'
import Header from './components/header';
import Search from './components/search'
import Filter from './components/filter'
import Table from './components/students-table';


interface DataStudents {
  id: number;
  attributes: {
    surname: string;
    name: string;
    patronymic: string;
    course: number;
    specialty: string
  };
}

interface StudentProps {
  data: DataStudents[]
}


export default function Home() {
  
  let [students, setStudents] = useState<StudentProps>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSpecialty, setFilteredSpecialty] = useState<string | null>(null);
  const [filteredCourse, setFilteredCourse] = useState<number[] | null>(null);

  const specialty = [
    "Все направления",
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

  useEffect(() => {     
    const fetchData = async () => {       
      const studentsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/students?populate=*`);
      setStudents(studentsResponse);
    };
    fetchData();   
  }, []);


  const filteredStudents = useMemo(() => {
    if (!students) return [];
    let filteredData = students.data;
    
    // Фильтрация по специальности
    if (filteredSpecialty) {
      filteredData = filteredData.filter(student => student.attributes.specialty === filteredSpecialty);
    }

    // Фильтрация по курсу
    if (filteredCourse) {
      filteredData = filteredData.filter(student => filteredCourse.includes(student.attributes.course));
    }
    // filteredData = filteredData.filter(student => student.attributes.course === Number(filteredCourse));

    // Поиск по запросу
    if (searchQuery) {
      const searchResults = filteredData.filter(student => 
        student.attributes.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.attributes.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      filteredData = searchResults;
    }

    return filteredData;
  }, [students, filteredSpecialty, filteredCourse, searchQuery]);


  return (
    <div>
      <Header />

      <div className="flex justify-between px-11 pt-16 pb-12 flex-wrap gap-5 lg:flex-nowrap max-sm:p-6 max-sm:pt-11">
        <Search setSearchQuery={setSearchQuery} />
        <Filter values={specialty} updateFilteredValues={setFilteredSpecialty} type={'rounden-lg'}/>
      </div>

      <div className='px-11 max-sm:p-6 max-sm:pt-11'>
        <Suspense fallback={<Loading />}>
          <Table students={filteredStudents} studentLinks={{ href: "portfolio" }} type={'all'}/>
        </Suspense>
      </div> 
    </div>
  );
}