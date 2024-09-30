'use client'
import React, { useEffect, useState } from 'react';
import StatisticsChart from '@/app/components/statistics/chart';
import { Student } from '@/app/components/interfaces/statistics';
import { fetcher } from "@/lib/api"

interface Props {
    studentId: number;
}

const StatisticsStudent = ({studentId}: Props) => {
    let [student, setStudent] = useState<Student[]>([]);
    useEffect(() => {     
        const fetchData = async () => {       
            try {
                const responseStudents = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/students/${studentId}?populate=*`);
                const studentsData = responseStudents.data;
                setStudent([studentsData]);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        fetchData();   
    }, []);

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