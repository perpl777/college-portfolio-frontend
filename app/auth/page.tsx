'use client'
import React, { useState } from 'react';

import { fetcher } from '@/lib/api';
import { setAuthData } from '@/lib/auth';
import {useUser} from "@/lib/authContext";

import EmailIcon from "@/public/login-icons/mail_FILL0_wght400_GRAD0_opsz24.svg";
import LockIcon from "@/public/login-icons/lock_FILL0_wght400_GRAD0_opsz24.svg";

import Image from 'next/image';

import HeaderMin from '@/app/admin/components/header-min';
import ButtonStroke from '../admin/components/btn';
import ErrorMess from "@/app/components/errorMess"



const Auth = () => {

    const [data, setData] = useState(
        {
            "identifier": "",
            "password": ""
        }
    )
    
    const [error, setError] = useState<string | undefined>(undefined);

    const {user, loading} = useUser();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
    
        try {
            const response = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/local`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    identifier: data.identifier,
                    password: data.password
                }),
            });
    
            if (response.error) {
                console.error('Error:', response.error);
                setError('Error');
                return;
            }
    
            setAuthData(response);

            window.location.href = '/admin';
        } 

        catch (error) {
            console.error('Error:', error);
            setError('Error');
        }
    };

    const handleChange = (e: any) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    return (
        <div className='p-11'>
            <HeaderMin title='Вход'/>

            <form onSubmit={handleSubmit} className='flex justify-center flex-col gap-10 items-center'>
                <div className='flex gap-5 w-[30rem] max-sm:w-full'>
                    <Image src={EmailIcon} alt="email" />
                    <label className="my-5 border-b border-gray-500 flex gap-2 items-center w-full">
                        <input 
                            name="identifier"
                            type="text" 
                            className="grow outline-none p-2 w-full" 
                            placeholder="Логин"
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div className='flex gap-5 w-[30rem] max-sm:w-full'>
                    <Image src={LockIcon} alt="lock" />
                    <label className="my-5 border-b border-gray-500 flex gap-2 items-center w-full">
                        
                        <input 
                            name="password"
                            type="password" 
                            className="grow outline-none p-2 w-full" 
                            placeholder="Пароль"
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>

                <ButtonStroke text='Войти' />

                {error && <ErrorMess text='Неверный логин или пароль'></ErrorMess>}
            </form>
        </div>
    );
};

export default Auth;