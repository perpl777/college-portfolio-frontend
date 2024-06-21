'use client'
import React, { useEffect, useState } from 'react';

import {fetcher} from "@/lib/api"

import { getAuthData } from '@/lib/auth';
import Cookies from 'js-cookie';

import ArrowIcon from '@/public/Arrow.svg'
import Link from 'next/link';
import Image from 'next/image';

import Header from '@/app/components/header';
import StudentCard from '@/app/components/students/student-card';
import Buttons from '@/app/components/accept-reject-btns';


interface Props {
    params: {
        profileId: number
    }
}

interface DataStudent {
    id: number,
    attributes: {
        surname: string,
        name: string,
        course: number,
        about_info: string,
        published: boolean,
        technologies: {
            data: {
                attributes: {
                    name: string
                }
            }
        },
        url_behance?: string,
        url_github?: string,
        url_vk?: string,
        specialization: {
            data: {
                attributes: {
                    name: string
                }
            }
        },
        url_photo?: string,
    }
}

interface UserRoleProps {
    student: {
        name: string
    }
    role: {
        name: string
    }
}


export default function Profile({ params: {profileId}}: Props) {
    const { id } = getAuthData();
    const [user, setUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<UserRoleProps>();

    const [student, setStudent] = useState<DataStudent>();
    const [technologiesString, setTechnologiesString] = useState("");


    //получение email user
    useEffect(() => {
        const userData = Cookies.get('email');
        if (userData) {
            setUser(userData);
        }
        setLoading(false);
    }, []);


    //фетч к юзеру
    useEffect(() => {     
        const fetchData = async () => {     
            const userDataResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/${id}?populate=*`);
            setUserRole(userDataResponse)
        };
        fetchData();   
    }, []);


    //фетч к студенту
    useEffect(() => {
        const fetchData = async () => {     
            const studentResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/students/${profileId}?populate=*`);
            setStudent(studentResponse.data);

            if (studentResponse.data) {
                const technologies = studentResponse.data.attributes.technologies.data.map((tec: any) => tec.attributes ? tec.attributes.name : "");
                setTechnologiesString(technologies.join(", "));
            }
        };
    fetchData();
    }, []);


    return (
    <>
        { user && userRole?.role.name === "Moderator" &&
            <div className='pb-20'>
                <Header />
                <div className='px-11 pb-10 pt-12 max-sm:px-6 max-sm:pb-6 max-sm:pt-8'>
                    <Link href={`#${profileId}`} onClick={() => window.history.back()}>
                        <Image src={ArrowIcon} alt="Arrow Icon" width={25} />
                    </Link>
                </div>
                <div className='border-y border-black mb-12 max-sm:mb-10'>
                    <div className="max-lg:m-auto px-11 max-lg:px-6">
                        {student &&
                            <StudentCard 
                                surname={student.attributes?.surname}
                                name={student.attributes?.name}
                                course={student.attributes?.course}
                                technologies={technologiesString}
                                url_behance={student.attributes?.url_behance}
                                url_github={student.attributes?.url_github}
                                url_vk={student.attributes?.url_vk}
                                specialization={student.attributes.specialization.data.attributes.name}
                                url_photo={student.attributes.url_photo}
                            /> 
                        }
                    </div>
                    <div className="flex justify-end pt-10 pb-10 px-11 font-light text-xl max-lg:text-lg max-lg:px-6 max-lg:pt-8">
                        <div className='w-4/6 max-[480px]:w-10/12 text-overflow-ellipsis'>
                            {student?.attributes?.about_info}
                        </div>
                    </div>
                </div>
                <div className='flex justify-center'>
                    <Buttons />
                </div>
            </div>
        }
    </>
    );
}