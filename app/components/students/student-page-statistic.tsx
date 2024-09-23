'use client'
import React, { useEffect, useState } from 'react';
import StatisticsChart from '@/app/components/statistics/chart';
import { Student } from '@/app/components/interfaces/statistics';
import { fetcher } from "@/lib/api"


const StatisticsStudent = () => {
    let [student, setStudent] = useState<Student[]>([]);
    
    // const oneYearAgoISO = new Date();
    // oneYearAgoISO.setFullYear(oneYearAgoISO.getFullYear() - 1);

    //Получение данных из бд
    useEffect(() => {     
        const fetchData = async () => {       
            try {
                const responseStudents = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/students?populate=*`);
                const studentsData = responseStudents.data;
                setStudent(studentsData);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        fetchData();   
    }, []);
    useEffect(() => {     
        console.log(student)
    }, [student]);

return (
    <div className=''>
        {student ? (
                <StatisticsChart students={student} />
            ) : (
                <p>Loading...</p>
            )}
    </div>
    );
};

export default StatisticsStudent;