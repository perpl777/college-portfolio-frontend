
'use client'
import React, { useEffect, useState } from 'react';

import Header from "../components/header";
import Navbar from '../components/navbar';
import MyProfile from '../components/students/my-profile';
import MyPosts from '../components/posts/my-posts';
import StatisticsStudent from '@/app/components/students/student-page-statistic';
import { useUser } from './components/context';

export default function MyProfilePage() {
    const { user, role, loading } = useUser();
    const [selectedBtn, setSelectedBtn] = useState<string>('Работы');
    const values = ['Активность', 'Профиль', 'Работы'];
    const handleCategoryClick = (value: string) => {
        setSelectedBtn(value);
    };

    useEffect(() => {
        const savedCategory = localStorage.getItem('selectedCategory');
        const savedIndex = localStorage.getItem('activeButtonIndex');

        if (savedCategory) {
            setSelectedBtn(savedCategory);
        }
    }, []);

    if (loading) {
        return <div>Загрузка...</div>; // Простое сообщение о загрузке
    }

    if (!user) {
        return <div>Ошибка сервера, попробуйте перезайти на аккаунт</div>;
    }


    return (
        <>
            { user && 
            <>
                { role === "Authenticated" &&
                    <div className='space-y-12 max-sm:space-y-8'>
                        <Header />
                        <div className='px-11 flex justify-end max-sm:px-6'>
                            <Navbar values={values} handleCategoryClick={handleCategoryClick} selectedBtn={selectedBtn}/>
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