'use client'
import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { fetcher } from '@/lib/api';
import Loading from '../../loading'
import Table from '../students/students-table';


interface StudentsProps {
    data: DataStudents[] | undefined
}


interface DataStudents {
    id: number;
    attributes: {
        surname: string;
        name: string;
        patronymic: string;
        pubslished: boolean;
        specialization: {
            data: {
                attributes: {
                    name: string
                }
            }
        }
    };
}


export default function UnpublishedProfiles() {

    const [students, setStudents] = useState<StudentsProps>();

     //фетч
    useEffect(() => {     
        const fetchData = async () => {       
            const studentsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/students?populate=*`);
            setStudents(studentsResponse);
        };
        fetchData();   
    }, []);


    //сортируем на только неопубликованных
    const filteredStudents = useMemo(() => {
        if (!students) return [];

        let filteredData = students.data?.filter((student: any) => { 
            return (student.attributes.published === false)
        });

        return filteredData;
    }, [students]);


    return (
        <div className='px-11 max-sm:p-6'>
            {filteredStudents !== null
            ?
                <Suspense fallback={<Loading />}>
                    <Table students={filteredStudents} studentLinks={{ href: `moderation/profile` }}/>
                </Suspense>
            :
                (<div className="text-center text-zinc-400 text-lg mt-16">Данных нет</div>)
            }
        </div> 
    );
}