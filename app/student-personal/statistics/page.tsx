'use client'
import React, { useEffect, useState } from 'react';
import StatisticsChart from '@/app/components/statisticsChart/chart';
import { Student, Period, StatisticsData, ChartData } from '@/app/components/statisticsChart/interface';
import { fetcher } from "@/lib/api"
  

const StatisticsPage = () => {
    let [students, setStudents] = useState<Student[]>([]);
    let [posts, setPosts] = useState<Student[] | null>(null);
    
    const oneYearAgoISO = new Date();
    oneYearAgoISO.setFullYear(oneYearAgoISO.getFullYear() - 1);

    //Получение данных из бд
    useEffect(() => {     
        const fetchData = async () => {       
            try {
                // const responsePosts = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/posts?populate=*&filters[createdAt][$gte]=${oneYearAgoISO.toISOString()}`);
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

export default StatisticsPage;