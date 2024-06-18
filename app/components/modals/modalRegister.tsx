'use client'
import React, { useState } from "react";
import { fetcher } from '@/lib/api';

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
            "username": "",
            "email": "",
            "password": ""
        }
    )


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const response = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/local/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: data.username,
                    email: data.email,
                    password: data.password
                }),
            });
            if (response.error) {
                console.error('Error:', response.error);
                return;
            }
            window.location.href = '/';
            console.log('acces');
        } 
        catch (error) {
            console.error('Error:', error);
        }
    };

    const handleChange = (e: any) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }


    return (
        <dialog className="modal bg-black/70" open={openModalRegister}>
            <div className="modal-box py-14 max-sm:w-full rounded-none flex items-center justify-center">
                <div className="modal-action absolute -top-2 right-6">
                    <form method="dialog">
                        <button className='text-5xl font-light' onClick={handleCloseModalRegister}>&times;</button>
                    </form>
                </div>
                <form onSubmit={handleSubmit}  className="flex flex-col items-center w-8/12 max-sm:w-10/12">
                    <h1 className="montserrat text-3xl mt-8">
                        Регистрация
                    </h1>
                    <div className="mt-14 space-y-7">
                        <input 
                            type="text" 
                            name="email"
                            placeholder="Почта.."
                            onChange={handleChange}
                            required
                            className="w-full p-1 font-light text-lg text-gray border-b border-gray-800 outline-none"
                        />
                        <input 
                            type="text" 
                            name="username"
                            placeholder="Логин.."
                            onChange={handleChange}
                            required
                            className="w-full p-1 font-light text-lg text-gray border-b border-gray-800 outline-none"
                        />
                        <input 
                            name="password"
                            type="password" 
                            placeholder="Пароль.."
                            onChange={handleChange}
                            required
                            className="w-full p-1 font-light text-lg text-gray border-b border-gray-800 outline-none"
                        />
                        <div>
                            {/* {error && <ErrorMess text='Ошибка'></ErrorMess>} */}
                        </div>

                    </div>
                    <button
                        type="submit"
                        className="bg-black mt-10 text-slate-50 w-full h-14 text-lg transition-colors hover:bg-white hover:border hover:text-black hover:border-black"
                    >Зарегистрироваться</button>

                    <div className="mt-3 flex justify-center w-full">
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