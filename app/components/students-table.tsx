import React, { Suspense } from 'react'
import Loading from '@/app/loading';
import { FC } from 'react';
import Link from 'next/link';


interface DataStudents {
    id: number;
    attributes: {
        surname: string;
        name: string;
        patronymic: string;
        specialization: {
            data: {
                attributes: {
                    name: string
                }
            }
        }
    }
};

interface StudentLinkProps {
    href: string;
}

/*отображаем ФИО, курс и группу либо только ФИО */
type type = 'all' | 'only_name'
interface TableProps {
    students?: DataStudents[];
    studentLinks?: StudentLinkProps;
    type?: type;
}


const Table:FC<TableProps> = ({ students, studentLinks, type = 'all' }: TableProps) => {
    return (
        <>
            <div className='overflow-x-auto'>
                {type == 'only_name' 
                ? 
                <table className='table table-lg m-auto'>
                    <tbody>
                        <Suspense fallback={<Loading />}>
                            {students && students.map((student: any) => {
                                return (
                                    <tr 
                                        key={student.id} 
                                        className={`border-b border-black hover:bg-stone-100 transition-all  active:bg-gray-800 active:text-gray-300 active:duration-75`}
                                    >
                                        <td> 
                                            <Link href={`/${studentLinks?.href}/${student.id}`}>
                                                {`${student.attributes.surname} 
                                                ${student.attributes.name}`}
                                            </Link>
                                        </td>
                                    </tr>
                            )})}
                        </Suspense>
                    </tbody>
                </table>
                :
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
                                return (
                                    <tr 
                                        key={student.id} 
                                        className={`border-b border-black hover:bg-stone-100 transition-all active:bg-gray-800 active:text-gray-300 active:duration-75`}
                                    >
                                        <td className='w-2/12 max-sm:w-8 max-sm:flex max-sm:items-start'>{index + 1}</td>
                                        <td className='w-4/12 max-sm:w-auto max-sm:pr-0'> 
                                            <Link href={`/${studentLinks?.href}/${student.id}`}>
                                                {`${student.attributes.surname} 
                                                ${student.attributes.name} 
                                                ${student.attributes?.patronymic ? student.attributes?.patronymic : ''}`}
                                            </Link>
                                            <p className='pt-4 sm:hidden max-sm:text-gray-500'>{student.attributes.specialization.data.attributes.name}</p>
                                        </td>
                                        <td className='w-5/12 max-sm:hidden'>{student.attributes.specialization.data.attributes.name}</td>
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
                }
            </div>
        </>
    );
};

export default Table;
