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
        {text: " "},
        {text: "Студент"},
        {text: "Специальность"},
        {text: " "}
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
                                <th key={textTh.text} className='border-b border-black text-sm text-slate-400  font-normal leading-6'> 
                                    {textTh.text} 
                                </th>
                            )}
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
                                        <td className='w-2/12'>{index + 1}</td>
                                        <td className='w-4/12'> 
                                            <Link href={`/${studentLinks?.href}/${student.id}`}>
                                                {`${student.attributes.surname} 
                                                ${student.attributes.name} 
                                                ${student.attributes?.patronymic ? student.attributes?.patronymic : ''}`}
                                            </Link>
                                        </td>
                                        <td  className='w-5/12'>{student.attributes.specialty}</td>
                                        <td>
                                            {(index === 0 || index === 1 || index === 2)  &&
                                                <div className='border w-20 border-gray-700 py-[5px] rounded-sm montserrat text-center text-gray-700 text-xs'>ТОП {index + 1}</div>
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
