'use client'
import React, {useState} from "react";

import { fetcher } from '@/lib/api';
import { setAuthData } from '@/lib/auth';
// import {useUser} from "@/lib/authContext";
import ErrorMess from "./errorMess";


interface ModalProps {
    openModal: boolean;
    handleCloseModal: () => void;
}


const ModalLogin = ({ openModal, handleCloseModal }: ModalProps) => {

    const [registrationMode, setRegistrationMode] = useState(false);
    const [forgotPassword, setForgotPassword] = useState(false);

    const [data, setData] = useState(
        {
            "email": "",
            "password": ""
        }
    )

    const [error, setError] = useState<string | undefined>(undefined);
    // const {user, loading} = useUser();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError(undefined)
        
        try {
            const response = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/local`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    identifier: data.email,
                    password: data.password
                }),
            });
    
            if (response.error) {
                console.error('Error:', response.error);
                setError('Error');
                return;
            }
            setAuthData(response);

            window.location.href = '/';
        } 
        catch (error) {
            console.error('Error:', error);
            setError('Error');
        }
    };

    const handleChange = (e: any) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const handleRegistrationClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); 
        setRegistrationMode(true);
        setError(undefined)
    };

    const handleForgotPasswordClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setForgotPassword(true);
        setError(undefined)
    };

    const handleLoginClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); 
        setRegistrationMode(false);
        setForgotPassword(false);
    };


    return (
        <dialog className="modal bg-black/70" open={openModal}>
            <div className="modal-box py-14 max-sm:w-full rounded-none flex items-center justify-center">
                <div className="modal-action absolute -top-2 right-6">
                    <form method="dialog">
                        <button className='text-5xl font-light' onClick={handleCloseModal}>&times;</button>
                    </form>
                </div>
                <form onSubmit={handleSubmit}  className="flex flex-col items-center w-8/12 max-sm:w-10/12">
                    <h1 className="montserrat text-3xl mt-8">
                        {forgotPassword ? "Восстановление пароля" : (registrationMode ? "Регистрация" : "Вход")}
                    </h1>

                    {forgotPassword ?
                        <input 
                            type="text" 
                            name="email"
                            placeholder="Почта.."
                            onChange={handleChange}
                            required
                            className="w-full p-1 mt-10 font-light text-lg text-gray border-b border-gray-800 outline-none"
                        />
                    :
                    <div className="mt-12 space-y-6">
                        <input 
                            type="text" 
                            name="email"
                            placeholder="Почта.."
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
                    </div>
                    }

                    <div className="mt-56 absolute">
                        {error && <ErrorMess text='Неверная почта или пароль'></ErrorMess>}
                    </div>

                    <button
                        type="submit"
                        className="bg-black mt-16 text-slate-50 w-full h-14 text-lg transition-colors hover:bg-white hover:border hover:text-black hover:border-black"
                    >
                        {forgotPassword ? "Восстановить пароль" : (registrationMode ? "Зарегистрироваться" : "Войти")}
                    </button>

                    {forgotPassword ? 
                        <div className="mt-4 flex justify-end w-full">
                            <button
                                className="text-gray-800 font-light hover:text-zinc-400 max-sm:text-sm"
                                onClick={handleLoginClick}
                            >
                                Зайти в аккаунт
                            </button>
                        </div>
                    : (registrationMode ? 
                        <div className="mt-4 flex justify-end w-full">
                            <button
                                className="text-gray-800 font-light hover:text-zinc-400 max-sm:text-sm"
                                onClick={handleLoginClick}
                            >
                                У меня есть аккаунт
                            </button>
                        </div>
                    : 
                        <div className="mt-4 flex justify-between w-full">
                            <button
                                className="text-gray-800 font-light hover:text-zinc-400 max-sm:text-sm"
                                onClick={handleForgotPasswordClick}
                            >
                                Забыли пароль
                            </button>
                            <button
                                className="text-gray-800 font-light hover:text-zinc-400 max-sm:text-sm"
                                onClick={handleRegistrationClick}
                            >
                                У меня нет аккаунта
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </dialog>
    );
};

export default ModalLogin;