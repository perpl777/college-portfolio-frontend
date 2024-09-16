'use client'

import React, { useEffect, useState } from 'react';

import {fetcher} from "@/lib/api"

import { getAuthData } from '@/lib/auth';
import Cookies from 'js-cookie';

import Header from "../components/header";
import UnpublishedPosts from '../components/posts/unpublished-posts';
import UnpublishedProfiles from '../components/students/unpublished-profiles';
import SliderWithoutCheckbox from '../components/slider-without-checkbox/slider-without-checkbox';


interface UserRoleProps {
    student: {
        name: string
    }
    role: {
        name: string
    }
}


export default function ModerationPage() {
    const { id } = getAuthData();
    const [user, setUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<UserRoleProps>();

    const [activeButton, setActiveButton] = useState<number>(0);
    const [selectedBtn, setSelectedBtn] = useState<string>('Профили');
    const values = ['Профили', 'Работы']

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


    const handleCategoryClick = (index: number, value: string) => {
        setActiveButton(index);
        setSelectedBtn(value);
    };

    return (
        <>
        { user && 
            <>
            { userRole?.role.name === "Moderator" &&
                <div>
                    <Header />
                    <div className='px-11 pt-12 pb-10 max-sm:pt-10 max-sm:pb-4 max-sm:px-6'>
                        <SliderWithoutCheckbox values={values} handleCategoryClick={handleCategoryClick} activeButton={activeButton}/>
                    </div>
                    { selectedBtn === "Профили" 
                    ?
                        <UnpublishedProfiles />
                    :
                        <UnpublishedPosts />
                    }
                </div>
            }
            </>
        }
        </>
    );
}