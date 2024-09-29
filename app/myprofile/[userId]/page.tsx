'use client'
import React, { useState, useEffect } from 'react';
import { fetcher } from '@/lib/api';
import { getAuthData } from '@/lib/auth';
import Cookies from 'js-cookie';
import Header from "../../components/header";
import Navbar from '../../components/navbar';
import MyProfile from '../../components/students/my-profile';
import MyPosts from '../../components/posts/my-posts';
import StatisticsStudent from '@/app/components/students/student-page-statistic';

interface Props {
    params: {userId: number};
}

interface UserRoleProps {
    student: {
        id: number
        name: string
    }
    role: {
        name: string
    }
}

export default function MyProfilePage({ params: { userId } }: Props) {
    const { id } = getAuthData();
    const [user, setUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [userRoleAndStudent, setUserRoleAndStudent] = useState<UserRoleProps>();

    const [activeButton, setActiveButton] = useState<number>(2);
    const [selectedBtn, setSelectedBtn] = useState<string>('Работы');
    const [values, setValues] = useState(['Активность', 'Профиль', 'Работы'])
   
   //получение email user
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
            setUserRoleAndStudent(userDataResponse)
        };
        fetchData();   
    }, []);

    useEffect(() => {
        if (userRoleAndStudent?.student === null) {
            setValues(['Профиль', 'Работы'])
            setActiveButton(1)
        }
    }, [userRoleAndStudent])

    const handleCategoryClick = (index: number, value: string) => {
        setActiveButton(index);
        setSelectedBtn(value);
    };

    return (
        <>
            { user && 
            <>
                { userRoleAndStudent?.role.name === "Authenticated" &&
                    <div className='space-y-14 max-sm:space-y-10'>
                        <Header />
                        <div className='px-11 flex justify-end max-sm:px-4'>
                            <Navbar values={values} handleCategoryClick={handleCategoryClick} activeButton={activeButton}/>
                        </div>
                        <div className='px-11 max-sm:px-4 pb-24'>
                            { selectedBtn === 'Профиль' &&
                                <MyProfile />
                            }
                            { selectedBtn === 'Работы' &&
                                <div><MyPosts /></div>
                            }
                            { selectedBtn === 'Активность' &&
                                <div><StatisticsStudent studentId={userRoleAndStudent.student.id} /></div>
                            }
                        </div>
                    </div>
                }
            </>
            }
        </>
    );
}