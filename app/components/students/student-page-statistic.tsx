'use client'
import React, { useEffect, useState } from 'react';
import StatisticsChart from '@/app/components/statistics/chart';
import { Student } from '@/app/components/interfaces/statistics';
import { fetcher } from "@/lib/api"


const StatisticsStudent = () => {
    let [students, setStudents] = useState<Student[]>([]);
    
    // const oneYearAgoISO = new Date();
    // oneYearAgoISO.setFullYear(oneYearAgoISO.getFullYear() - 1);

    //Получение данных из бд
    useEffect(() => {     
        const fetchData = async () => {       
            try {
                const responseStudents = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/students?populate=*`);
                const studentsData = responseStudents.data;
                setStudents(studentsData);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        fetchData();   
    }, []);

return (
    <div className=''>
        {students ? (
                <StatisticsChart students={students} />
            ) : (
                <p>Loading...</p>
            )}
    </div>
);
};

export default StatisticsStudent;