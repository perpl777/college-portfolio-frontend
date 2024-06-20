'use client'

import React, { useEffect, useState } from 'react';

import {fetcher} from "@/lib/api"

import { getAuthData } from '@/lib/auth';
import Cookies from 'js-cookie';

import Header from "../components/header";



interface UserRoleProps {
    student: {
        name: string
    }
    role: {
        name: string
    }
}


export default function MyProfilePage() {
    const { id } = getAuthData();
    const [user, setUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<UserRoleProps>();


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

    
    return (
        <>
            { user && 
            <>
                { userRole?.role.name === "Student" &&
                    <div className='space-y-12 max-sm:space-y-8'>
                        <Header />
                    </div>
                }
            </>
            }
        </>
    );
}