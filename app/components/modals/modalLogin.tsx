'use client'
import React, {useState} from "react";

import { fetcher } from '@/lib/api';
import { getAuthData, setAuthData } from '@/lib/auth';
import { isValidEmail } from '@/lib/utils/validationUtils';
import ErrorMess from "../errorMess";
import Loading from '@/app/loading'


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


    const [error, setError] = useState<string | undefined>(undefined);
    const [data, setData] = useState(
        {
            "email": "",
            "password": ""
        }
    )
    const [loading, setLoading] = useState<boolean>(false);
    
    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (data.password.length < 6) {
            setError('Неверный пароль');
        }
          // Проверка настоящего email
        else if (!isValidEmail(data.email)) {
            setError('Пожалуйста, введите настоящий email.');
        }
        else {
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
                    setError('Неверная почта или пароль');
                    return;
                }
                setLoading(true)
                setAuthData(response);
                const page = await defineRole()
                window.location.href = `/${page}`;
            } 
            catch (error) {
                setError('Неверная почта или пароль');
                console.error('Error:', error);
                setLoading(false)
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
    
    const handleChange = (e: any) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    return (
        <dialog className="modal bg-black/70" open={openModalLogin}>
            {loading ? ( <Loading />) : (
            <div className="modal-box py-10 max-sm:w-full rounded-none flex items-center justify-center m-10">
                <div className="modal-action absolute -top-3 right-6">
                    <form method="dialog">
                        <button className='text-5xl font-light' onClick={handleCloseModalLogin}>&times;</button>
                    </form>
                </div>
                <form onSubmit={handleSubmit}  className="flex flex-col items-center w-4/6 max-sm:w-10/12">
                    <h1 className="text-3xl mt-8 font-bold">
                        Вход
                    </h1>
                    <div className="mt-14 space-y-6">
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
                            {error && <ErrorMess text={error}></ErrorMess>}
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="bg-black mt-12 text-slate-50 w-full h-14 text-lg transition-colors hover:bg-white hover:border hover:text-black hover:border-black"
                    >
                        Войти
                    </button>
                    <div className="mt-3 flex justify-end w-full">
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
            )}
        </dialog>
    );
};

export default ModalLogin;