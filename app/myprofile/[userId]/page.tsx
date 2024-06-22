'use client'
import React, { useState, useEffect } from 'react';
import { fetcher } from '@/lib/api';

import { getAuthData } from '@/lib/auth';
import Cookies from 'js-cookie';

import Header from "../../components/header";
import Navbar from '../../components/navbar';
import MyProfile from '../my-profile';
import MyPosts from '../my-posts';


interface Props {
    params: {userId: number};
}


interface UserRoleProps {
    student: {
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
    const [userRole, setUserRole] = useState<UserRoleProps>();

    const [activeButton, setActiveButton] = useState<number>(2);
    const [selectedBtn, setSelectedBtn] = useState<string>('Профиль');
    const values = ['Активность', 'Работы', 'Профиль']


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


    const handleCategoryClick = (index: number, value: string) => {
        setActiveButton(index);
        setSelectedBtn(value);
    };


    return (
        <>
            { user && 
            <>
                { userRole?.role.name === "Authenticated" &&
                    <div className='space-y-12 max-sm:space-y-8'>
                        <Header />
                        <div className='px-11 flex justify-end max-sm:px-6'>
                            <Navbar values={values} handleCategoryClick={handleCategoryClick} activeButton={activeButton}/>
                        </div>
                        <div className='px-11 max-sm:px-6 pb-20'>
                            { selectedBtn === 'Профиль' &&
                                <MyProfile />
                            }
                            { selectedBtn === 'Работы' &&
                                <div>bbbbbb</div>
                            }
                            { selectedBtn === 'Активность' &&
                                <div>aaaaaaaa</div>
                            }
                        </div>
                    </div>
                }
            </>
            }
        </>
    );
}