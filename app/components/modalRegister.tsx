'use client'
import React, { useState } from "react";


interface ModalProps {
    openModal: boolean;
    handleCloseModal: () => void;
}


const ModalRegister = ({ openModal, handleCloseModal}: ModalProps) => {
    return (
        <dialog className="modal bg-black/70">
            <div className="modal-box py-14 w-4/12 max-sm:w-full rounded-none flex items-center justify-center">
                <div className="modal-action absolute top-0 right-6">
                    <form method="dialog">
                        <button className='text-5xl font-light' onClick={handleCloseModal}>&times;</button>
                    </form>
                </div>
                <form className="flex flex-col items-center w-9/12 max-sm:w-10/12">
                    <h1 className="montserrat text-3xl mt-8">Регистрация</h1>

                    <div className="mt-10 space-y-6">
                        <input 
                            type="text" 
                            placeholder="Почта.."
                            className="w-full p-1 font-light text-lg text-gray border-b border-gray-800 outline-none"
                        />
                        <input 
                            type="text" 
                            placeholder="Пароль.."
                            className="w-full p-1 font-light text-lg text-gray border-b border-gray-800 outline-none"
                        />
                    </div>

                    <button type='submit' className="bg-black mt-16 text-white w-full h-14 text-lg transition-colors hover:bg-white hover:border hover:text-black hover:border-black">
                        Зарегистрироваться
                    </button>

                    <div className="mt-4 flex justify-end w-full">
                        <button className="text-gray font-light">У меня есть аккаунт</button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};

export default ModalRegister;