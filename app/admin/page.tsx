'use client'
import React, { Suspense, useEffect, useState, useMemo } from 'react'
import { gsap } from 'gsap'
import {fetcher} from "@/lib/api"
import Search from '../components/search'
import Table from '../components/students-table'
import Loading from '../loading'
import ButtonStroke from './components/btn'
import HeaderMin from './components/header-min'
import ModalAddStudent from './components/modal-add-student'
import {getAuthData} from "@/lib/auth"


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

interface UserData {
    course: number;
    specialty: {
        name: string
    }
}


const StudentsPage = () => {

    const { id } = getAuthData();

    let [students, setStudents] = useState<StudentProps>();
    let [userData, setUserData] = useState<UserData>();
    const [searchQuery, setSearchQuery] = useState('');
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {     
        const fetchData = async () => {     
            const userDataResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/${id}?populate=*`);
            const studentsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/students?populate=*`);
            setStudents(studentsResponse);
            setUserData(userDataResponse)
        };
        fetchData();   
    }, []);

    const filteredStudents = useMemo(() => {
        if (!students) return [];
        let filteredData = students.data;

        // выводим студентов куратора
        if (userData) {
            const searchResults = filteredData.filter(student =>
                student.attributes.course === userData?.course &&
                student.attributes.specialty?.toLowerCase() === userData?.specialty.name.toLowerCase()
            );
            filteredData = searchResults;
        }
        
        // Поиск по запросу
        if (searchQuery) {
            const searchResults = filteredData.filter(student => 
            student.attributes.surname.toLowerCase().includes(searchQuery.toLowerCase())
            );
            filteredData = searchResults;
        }
    
        return filteredData;
    }, [students, searchQuery]);
    

    useEffect(() => {
        gsap.from("h2", { 
            x: -50, 
            opacity: 0, 
            duration: 1, 
        }); 
        gsap.to("h2", { 
            x: 0, 
            opacity: 1, 
            duration: 1, 
        }); 
    }, []);
    
    const handleOpenModal = () => {
        setOpenModal(!openModal);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };


    return (
    <>
        <HeaderMin title="Студенты"/>

        <section className='w-full p-43'>
            <div className="flex justify-between pt-16 pb-12 flex-wrap gap-8 lg:flex-nowrap">
                <Search setSearchQuery={setSearchQuery}/>
                <div onClick={handleOpenModal}>
                    <ButtonStroke text="+ Добавить студента"/>
                </div>
            </div>

            <Suspense fallback={<Loading />}>
                <Table students={filteredStudents} studentLinks={{ href: "admin/portfolioes" }} type={'only_name'}/>
            </Suspense>
        </section>

        {/* модалка добавления студента */}
        <ModalAddStudent openModal={openModal} handleCloseModal={handleCloseModal}/>
    </>
    )
}

export default StudentsPage