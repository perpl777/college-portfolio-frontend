'use client'

import React, { useEffect, useState } from 'react';

import {fetcher} from "@/lib/api"

import { getAuthData } from '@/lib/auth';
import Cookies from 'js-cookie';

import Header from "../components/header";
import UnpublishedPosts from '../components/moderator/unpublished-posts';
import UnpublishedProfiles from '../components/moderator/unpublished-profiles';



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
    const [selectedBtn, setSelectedBtn] = useState<string>('Работы');
    const values = ['Работы', 'Профили']


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

    
    const stylesAdaptive = {
        menu: 'overflow-x-auto whitespace-nowrap',
        button: 'max-md:text-base',
    }


    return (
        <>
        { user && 
            <>
            { userRole?.role.name === "Moderator" &&
                <div>
                    <Header />
                    <div className={`px-11 py-12 flex items-center space-x-9  max-sm:pb-5 max-sm:px-6 ${stylesAdaptive.menu}`}>
                        {values && values.map((value: any, index: any) => (
                            <button
                                onClick={() => handleCategoryClick(index, value)}
                                key={index}
                                className={`text-left text-lg text-black p-2 ${index === activeButton ? 'border-b-2 border-black' : ''} ${stylesAdaptive.button}`}
                            >
                                {value}
                            </button>
                        ))}
                    </div>
                    { selectedBtn === "Работы" 
                    ?
                        <UnpublishedPosts />
                    :
                        <UnpublishedProfiles />
                    }
                </div>
            }
            </>
        }
        </>
    );
}