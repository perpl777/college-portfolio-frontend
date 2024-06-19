'use client'
import React, { useState } from "react";


interface ModalProps {
    openModal: boolean;
    handleCloseModal: () => void;
}


const ModalRecovery = ({ openModal, handleCloseModal}: ModalProps) => {
    return (
        <dialog className="modal bg-black/60" open={openModal}>
            <div className="modal-box py-14 max-sm:w-full rounded-none flex items-center justify-center">
                <div className="modal-action absolute top-0 right-6">
                    <form method="dialog">
                        <button className='text-5xl font-light' onClick={handleCloseModal}>&times;</button>
                    </form>
                </div>
                <form className="flex flex-col items-center w-3/4 max-sm:w-full">
                    <h1 className="montserrat text-3xl mt-8">Восстановление пароля</h1>

                    <div className="mt-14 space-y-7">
                        <input 
                            type="text" 
                            placeholder="Почта.."
                            className="w-full p-1 font-light text-xl text-gray border-b border-gray-800 outline-none"
                        />
                    </div>

                    <button type='submit' className="bg-black mt-20 text-white w-full h-14 text-lg">
                        Восстановить
                    </button>

                    <div className="mt-5 flex justify-end w-full">
                        <button className="text-gray font-light">Войти в аккаунт</button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};

export default ModalRecovery;