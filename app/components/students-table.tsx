import React, { Suspense } from 'react'
import Loading from '@/app/loading';
import { FC } from 'react';
import Link from 'next/link';


interface Data {
    id: number;
    attributes: {
        surname: string;
        name: string;
        patronymic?: string;
        course: number;
        specialty: string;
        };
}

interface StudentLinkProps {
    href: string;
}

/*отображаем ФИО, курс и группу либо только ФИО */
type type = 'all' | 'only_name'
interface TableProps {
    students?: Data[];
    studentLinks?: StudentLinkProps;
    type?: type;
}


const Table:FC<TableProps> = ({ students, studentLinks, type = 'all' }: TableProps) => {

    const textsTh = [
        {text: "Курс"},
        {text: "Студент"},
        {text: "Специальность"},
    ]

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
                            {textsTh.map((textTh) => 
                                <th key={textTh.text} className='border-b border-black text-sm text-slate-400 w-44 font-normal leading-6'> 
                                    {textTh.text} 
                                </th>
                            )}
                        </tr>
                    }
                    </thead>
                    <tbody>
                        <Suspense fallback={<Loading />}>
                            {students && students.map((student: any) => {
                                return (
                                <tr 
                                    key={student.id} 
                                    className={`border-b border-black hover:bg-stone-100 transition-all active:bg-gray-800 active:text-gray-300 active:duration-75`}
                                >
                                    <td>{student.attributes.course}</td>
                                    <td> 
                                        <Link href={`/${studentLinks?.href}/${student.id}`}>
                                            {`${student.attributes.surname} 
                                            ${student.attributes.name} 
                                            ${student.attributes?.patronymic ? student.attributes?.patronymic : ''}`}
                                        </Link>
                                    </td>
                                    <td>{student.attributes.specialty}</td>
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
