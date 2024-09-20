
'use client'
import React, { useState } from 'react';

import Header from "../components/header";
import Navbar from '../components/navbar';
import MyProfile from '../components/students/my-profile';
import MyPosts from '../components/posts/my-posts';
import StatisticsStudent from '@/app/components/students/student-page-statistic';
import { useUser } from './components/context';

export default function MyProfilePage() {
    const { user, role, loading } = useUser();
    const [activeButton, setActiveButton] = useState<number>(2);
    const [selectedBtn, setSelectedBtn] = useState<string>('Работы');
    const values = ['Активность', 'Профиль', 'Работы'];
    const handleCategoryClick = (index: number, value: string) => {
        setActiveButton(index);
        setSelectedBtn(value);
    };
    if (loading) {
        return <div>Loading...</div>; // Простое сообщение о загрузке
    }

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <>
            { user && 
            <>
                { role === "Authenticated" &&
                    <div className='space-y-12 max-sm:space-y-8'>
                        <Header />
                        <div className='px-11 flex justify-end max-sm:px-6'>
                            <Navbar values={values} handleCategoryClick={handleCategoryClick} activeButton={activeButton}/>
                        </div>
                        <div className='px-11 max-sm:px-6 pb-24'>
                            { selectedBtn === 'Профиль' &&
                                <MyProfile />
                            }
                            { selectedBtn === 'Работы' &&
                                <div><MyPosts /></div>
                            }
                            { selectedBtn === 'Активность' &&
                                <div><StatisticsStudent /></div>
                            }
                        </div>
                    </div>
                }
            </>
            }
        </>
    );
}