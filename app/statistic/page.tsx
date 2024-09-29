'use client'
import React, { useEffect, useMemo, useState } from 'react';
import StatisticsChart from '@/app/components/statistics/chart';
import { fetcher } from "@/lib/api"

import { getAuthData } from '@/lib/auth';
import Cookies from 'js-cookie';

import Header from '../components/header';
import Filter from '../components/filter';
import { getFiltredStudents } from '../components/rating/rating';
import { Student } from '../components/interfaces/statistics'
import Table from '../components/students/students-table';


interface UserRoleProps {
    student: {
        name: string
    }
    role: {
        name: string
    }
}


const StatisticsPage = () => {
    const { id } = getAuthData();
    const [user, setUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<UserRoleProps>();

    let [students, setStudents] = useState<Student[]>([]);
    const [filteredSpecialty, setFilteredSpecialty] = useState<string | null>(null);
    
    const specialty = [
        "Все специальности",
        "Информационные системы и программирование", 
        "Реклама", 
        "Дизайн (по отраслям)", 
        "Графический дизайн", 
        "Документационное обеспечение", 
        "Полиграфическое производство",
        "Печатное дело", 
        "Издательское дело",
        "Производство изделий из бумаги и картона", 
    ]

    useEffect(() => {
        const userData = Cookies.get('email');
        if (userData) {
            setUser(userData);
        }
        setLoading(false);
    }, []);

    useEffect(() => {     
        const fetchData = async () => {     
            const userDataResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/${id}?populate=*`);
            setUserRole(userDataResponse)
        };
        fetchData();   
    }, []);

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
        
        if (filteredSpecialty) {
        filteredData = filteredData.filter(student => student.attributes.specialization.data.attributes.name === filteredSpecialty);
        }

        return getRatingStudents(filteredData);
    }, [students, filteredSpecialty]);


    return (
    <>
        { user && 
            <>
            { userRole?.role.name === "Statistic" &&
                <div>
                    <Header />
                    <div className='p-10 relative max-sm:px-6'>
                        <div className="sm:absolute py-5  w-full flex sm:justify-start justify-end max-sm:pt-0 max-sm:justify-center">
                            <Filter values={specialty} updateFilteredValues={setFilteredSpecialty} type={'rounden-lg'}/>
                        </div>
                        {students ? (
                            <div className="">
                                <StatisticsChart students={filteredStudents} />
                                <div className='py-10'>
                                    <Table students={filteredStudents} studentLinks={{ href: "portfolio/" }}/>
                                </div>
                            </div>

                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                </div>
            }
            </>
            }
        </>
);
};

export default StatisticsPage;