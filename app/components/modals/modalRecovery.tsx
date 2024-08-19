'use client'
import React, {useState} from "react";
import ErrorMess from "../errorMess";


interface ModalProps {
    openModalRecovery: boolean;
    handleCloseModalRecovery: () => void;
    handleOpenModalLogin: any;
}


const ModalRecovery = ({ 
    openModalRecovery, 
    handleCloseModalRecovery, 
    handleOpenModalLogin
}: ModalProps) => {

    const [data, setData] = useState(
        {
            "email": "",
            "password": ""
        }
    )

    const handleChange = (e: any) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    return (
        <dialog className="modal bg-black/70" open={openModalRecovery}>
            <div className="modal-box py-12 max-sm:w-full rounded-none flex items-center justify-center m-10">
                <div className="modal-action absolute -top-2 right-6">
                    <form method="dialog">
                        <button className='text-5xl font-light' onClick={handleCloseModalRecovery}>&times;</button>
                    </form>
                </div>
                <form className="flex flex-col items-center w-4/6 max-sm:w-11/12">
                    <h1 className="text-3xl mt-6 font-bold">
                        Восстановление пароля
                    </h1>

                    <div className="space-y-6 w-full">
                        <input 
                            type="text" 
                            name="email"
                            placeholder="Почта.."
                            onChange={handleChange}
                            required
                            className="w-full p-1 mt-10 font-light text-lg text-gray border-b border-gray-800 outline-none"
                        />

                        <div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-black mt-10 text-slate-50 w-full h-14 text-lg transition-colors hover:bg-white hover:border hover:text-black hover:border-black"
                    >Восстановить пароль</button>

                    <div className="mt-3 flex justify-center w-full">
                        <button
                            className="text-gray-800 font-light hover:text-zinc-400 max-sm:text-sm"
                            onClick={handleOpenModalLogin}
                        >Зайти в аккаунт</button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};

export default ModalRecovery;