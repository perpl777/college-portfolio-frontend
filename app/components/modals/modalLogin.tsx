'use client'
import React, {useState} from "react";

import { fetcher } from '@/lib/api';
import { setAuthData } from '@/lib/auth';
import ErrorMess from "../errorMess";


interface ModalProps {
    openModalLogin: boolean;
    handleCloseModalLogin: () => void;
    handleOpenModalRegister: any
    handleOpenModalRecovery: any
}


const ModalLogin = ({ 
    openModalLogin, 
    handleCloseModalLogin, 
    handleOpenModalRegister, 
    handleOpenModalRecovery
}: ModalProps) => {

    const [data, setData] = useState(
        {
            "email": "",
            "password": ""
        }
    )

    const handleSubmit = async (e: any) => {
        e.preventDefault();
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
                return;
            }
            setAuthData(response);
            window.location.href = '/';
        } 
        catch (error) {
            console.error('Error:', error);
        }
    };

    const handleChange = (e: any) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }


    return (
        <dialog className="modal bg-black/70" open={openModalLogin}>
            <div className="modal-box py-14 max-sm:w-full rounded-none flex items-center justify-center">
                <div className="modal-action absolute -top-2 right-6">
                    <form method="dialog">
                        <button className='text-5xl font-light' onClick={handleCloseModalLogin}>&times;</button>
                    </form>
                </div>
                <form onSubmit={handleSubmit}  className="flex flex-col items-center w-8/12 max-sm:w-10/12">
                    <h1 className="montserrat text-3xl mt-8">
                        Вход
                    </h1>
                    <div className="mt-10 space-y-6">
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
                        <div>
                            {/* {error && <ErrorMess text='Неверная почта или пароль'></ErrorMess>} */}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-black mt-10 text-slate-50 w-full h-14 text-lg transition-colors hover:bg-white hover:border hover:text-black hover:border-black"
                    >
                        Войти
                    </button>

                    <div className="mt-3 flex justify-center w-full">
                        {/* <button
                            className="text-gray-800 font-light hover:text-zinc-400 max-sm:text-sm"
                            onClick={handleOpenModalRecovery}
                        >Забыли пароль</button> */}
                        <button
                            className="text-gray-800 font-light hover:text-zinc-400 max-sm:text-sm"
                            onClick={handleOpenModalRegister}
                        >У меня нет аккаунта</button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};

export default ModalLogin;