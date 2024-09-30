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
import Buttons from '@/app/components/btns/accept-reject-btns';

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
        about_info: string,
        published?: boolean,
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
        photo?: {
            data: {
                id: number,
                attributes: {
                    name: string,
                    url: string
                }
            }
        },
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
    const { jwt } = getAuthData();
    const [user, setUser] = useState<string | null>(null);
    const [blob, setBlob] = useState<Blob | null>(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<UserRoleProps>();

    const [student, setStudent] = useState<DataStudent>();
    const [technologiesString, setTechnologiesString] = useState("");

    useEffect(() => {
        const userData = Cookies.get('email');
        if (userData) {
            setUser(userData);
        }
        setLoading(false);
    }, []);

    useEffect(() => {     
        const fetchData = async () => {     
            const userDataResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/${id}?populate=*`);
            setUserRole(userDataResponse)
        };
        fetchData();   
    }, []);

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

    useEffect(() => {
        const fetchPhoto = async () => {             
            if (student?.attributes?.photo?.data?.attributes?.url) 
                {
                    const response = fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL_LOAD_FILES}${student?.attributes?.photo.data?.attributes?.url}`);
                    response.then(resp => resp.blob())
                    .then(fetchedBlob => setBlob(fetchedBlob));        
                }         
            };
        fetchPhoto();     
    }, [student?.attributes?.photo?.data?.attributes?.url])

    const handleRejectStudent = async () => {
        try {
            const response = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/students/${profileId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    data: {
                        published: null
                    }
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
            });
            if (response.error) {
                console.error('Error:', response.error);
                return;
            }
            window.location.href = '/moderation';
        } 
        catch (error) {
            console.error('Error:', error);
        }
    };

    const handlePublishStudent = async () => {
        try {
            const response = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/students/${profileId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    data: {
                        published: true
                    }
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
            });
            if (response.error) {
                console.error('Error:', response.error);
                return;
            }
            window.location.href = '/moderation';
        } 
        catch (error) {
            console.error('Error:', error);
        }
    };

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
                <div className='border-y border-black mb-12'>
                    <div className="max-lg:m-auto px-11 max-lg:px-6">
                        {student &&
                            <StudentCard 
                                surname={student.attributes?.surname}
                                name={student.attributes?.name}
                                course={student.attributes?.convergence?.data.attributes.course}
                                technologies={technologiesString}
                                url_behance={student.attributes?.url_behance}
                                url_github={student.attributes?.url_github}
                                url_vk={student.attributes?.url_vk}
                                specialization={student.attributes?.convergence?.data.attributes.full_name}
                                photo={blob ? URL.createObjectURL(blob) : ''}
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
                    <Buttons handleDelete={handleRejectStudent} handlePublish={handlePublishStudent}/>
                </div>
            </div>
        }
    </>
    );
}