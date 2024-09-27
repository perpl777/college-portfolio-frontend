'use client'
import React, { useState } from "react";
import { fetcher } from '@/lib/api';
import { getAuthData, setAuthData } from '@/lib/auth';
import { isValidEmail } from '@/lib/utils/validationUtils';

import ErrorMess from "../errorMess";


interface ModalProps {
    openModalRegister: boolean;
    handleCloseModalRegister: () => void;
    handleOpenModalLogin: any;
}


const ModalRegister = ({ 
    openModalRegister, 
    handleCloseModalRegister, 
    handleOpenModalLogin
}: ModalProps) => {
    
    const [data, setData] = useState(
        {
            "email": "",
            "password": ""
        }
    )
    const [error, setError] = useState<string | undefined>(undefined);


    const handleChange = (e: any) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }


    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const response = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users?filters[email][$eq]=${data.email}`);

        if (data.password.length < 6) {
            setError('Пароль должен содержать не менее 6 символов и хотя бы одну заглавную букву.');
        }
          // Проверка настоящего email
        else if (!isValidEmail(data.email)) {
            setError('Пожалуйста, введите настоящий email.');
        }
        else if (response.length !== 0) {
            setError('Пользователь с таким email уже существует.');
        }

        else {
            try {
                const response = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/local/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: data.email,
                        email: data.email,
                        password: data.password
                    }),
                });
                if (response.error) {
                    console.error('Error:', response.error);
                    return;
                }
                setAuthData(response);
                const page = await defineRole()
                window.location.href = `/${page}`;
            }
            catch (error) {
                console.error('Error:', error);
            }
        }
    };

    const defineRole = async () => {
        const { id } = getAuthData()
        const fetchData = async () => {     
            const response = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/${id}?populate=*`);
            return response.role.name
        }
        const userRole = await fetchData()
        
        if (userRole === "Moderator") {
            return "moderation"
        }
        else {
            return `myprofile/${id}`
        }
        
    }
    
    return (
        <dialog className="modal bg-black/70" open={openModalRegister}>
            <div className="modal-box py-12 max-sm:w-full rounded-none flex items-center justify-center m-10">
                <div className="modal-action absolute -top-2 right-6">
                    <form method="dialog">
                        <button className='text-5xl font-light' onClick={handleCloseModalRegister}>&times;</button>
                    </form>
                </div>
                <form onSubmit={handleSubmit}  className="flex flex-col items-center w-4/6 max-sm:w-10/12">
                    <h1 className="text-3xl mt-11 font-bold">
                        Регистрация
                    </h1>
                    <div className="mt-16 space-y-6">
                        <input 
                            type="text" 
                            name="email"
                            maxLength={70}
                            placeholder="Почта.."
                            onChange={handleChange}
                            required
                            className="w-full p-1 font-light text-lg text-gray border-b border-gray-800 outline-none"
                        />
                        <input 
                            name="password"
                            type="password" 
                            minLength={6}
                            maxLength={30}
                            placeholder="Пароль.."
                            onChange={handleChange}
                            required
                            className="w-full p-1 font-light text-lg text-gray border-b border-gray-800 outline-none"
                        />
                        <div>
                            {error && <ErrorMess text={error}></ErrorMess>}
                        </div>

                    </div>
                    <button
                        type="submit"
                        className="bg-black mt-14 text-slate-50 w-full h-14 text-lg transition-colors hover:bg-white hover:border hover:text-black hover:border-black"
                    >Зарегистрироваться</button>

                    <div className="mt-3 flex justify-end w-full">
                        <button
                            className="text-gray-800 font-light hover:text-zinc-400 max-sm:text-sm"
                            onClick={handleOpenModalLogin}
                        >У меня есть аккаунт</button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};

export default ModalRegister;