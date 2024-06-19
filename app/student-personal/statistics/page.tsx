'use client'
import React, { useEffect, useState } from 'react';
import StatisticsChart from '@/app/components/statisticsChart/ui';
import { Student, Period, StatisticsData, ChartData } from '@/app/components/statisticsChart/interface';
import { fetcher } from "@/lib/api"
  

const StatisticsPage = () => {
    let [students, setStudents] = useState<Student[] | null>(null);
    const [period, setPeriod] = useState<Period>('month');

    //Получение данных из бд
    useEffect(() => {     
        const fetchData = async () => {       
            try {
                const response = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/students?populate=*`);
                const data = response.data.map((item: { attributes: any; id: any; }) => ({
                    ...item.attributes,
                    id: item.id  // Сохранение идентификатора отдельно
                }));
                setStudents(data);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        fetchData();   
    }, []);

return (
    <div className=''>
        <h1>StatisticsPage</h1>
        <button onClick={() => setPeriod('month')}>Month</button>
        <button onClick={() => setPeriod('year')}>Year</button>
        <button onClick={() => students && console.log(students, students.length)}>students</button>
        {/* <StatisticsChart students={students} period={period}/> */}
        {students ? (
                <StatisticsChart students={students} period={period} />
            ) : (
                <p>Loading...</p>
            )}
    </div>
);
};

export default StatisticsPage;