'use'
import React, { Suspense } from 'react'
import Loading from '@/app/loading';
import { FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


interface DataStudents {
    id: number;
    attributes: {
        surname: string;
        name: string;
        patronymic: string;
        convergence?: {
            data: {
                id: number;
                attributes: {
                    name: string;
                    course: any;
                    full_name: string;
                }
            }
        }
    }
};


interface StudentLinkProps {
    href: string;
}



interface TableProps {
    students?: DataStudents[];
    studentLinks?: StudentLinkProps;
    startIndex?: number;
}


const Table:FC<TableProps> = ({ students, studentLinks, startIndex=0}: TableProps) => {
    const router = useRouter(); // Используйте useRouter

    const handleRowClick = (studentId: number, index: number) => {
        // Программный переход на другую страницу
        if (studentLinks) {
            const href = `/${studentLinks.href}/${studentId}`;
            
            // Добавляем index как query-параметр, если он от 0 до 2 (от топ 1 до топ 3)
            const urlWithQuery = (index >= 0 && index <= 2) ? `${href}?top=${index+1}` : href
            
            router.push(urlWithQuery);
        }
    };

    return (
        <>
            <div className='overflow-x-auto'>
                <table className='table table-lg m-auto'>
                    <thead>
                    {
                        <tr>
                            <th className='border-b border-black text-sm text-slate-400  font-normal leading-6'></th>
                            <th className='border-b border-black text-sm text-slate-400  font-normal leading-6'>Студент</th>
                            <th className='border-b border-black text-sm text-slate-400  font-normal leading-6 max-sm:hidden'>Специальность</th>
                            <th className='border-b border-black text-sm text-slate-400  font-normal leading-6'></th>
                        </tr>
                    }
                    </thead>
                    <tbody>
                        <Suspense fallback={<Loading />}>
                            {students && students.map((student: any, index: number) => {
                                index += startIndex

                                return (
                                    <tr 
                                        key={student.id} 
                                        className={`border-b border-black hover:bg-stone-100 hover:cursor-pointer transition-all active:bg-gray-800 active:text-gray-300 active:duration-75`}
                                        onClick={() => handleRowClick(student.id, index)}
                                    >
                                        <td className='w-2/12 max-sm:w-8 max-sm:flex max-sm:items-start'>{index + 1}</td>
                                        <td className='w-4/12 max-sm:w-auto max-sm:pr-0'> 
                                                {`${student.attributes.surname} 
                                                ${student.attributes.name} 
                                                ${student.attributes?.patronymic ? student.attributes?.patronymic : ''}`}
                                            <p className='pt-4 sm:hidden max-sm:text-gray-500'>{student.attributes?.convergence?.data?.attributes?.full_name}</p>
                                        </td>
                                        <td className='w-5/12 max-sm:hidden'>{student.attributes?.convergence?.data?.attributes?.full_name}</td>
                                        <td className='max-sm:flex max-sm:items-start'>
                                            {(index === 0 || index === 1 || index === 2)  &&
                                                <div className='max-sm:w-20 max-sm:text-gray-500 py-1 text-center montserrat text-xs'>ТОП {index + 1}</div>
                                            }
                                        </td>
                                    </tr>
                                )
                            })}
                        </Suspense>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Table;
