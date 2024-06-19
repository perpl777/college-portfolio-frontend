'use client'
import React, { useState } from "react";
import ModalRegister from "./modalRegister";


interface ModalProps {
    openModal: boolean;
    handleCloseModal: () => void;
}


const ModalLogin = ({ openModal, handleCloseModal}: ModalProps) => {

    const [openRegisterModal, setOpenRegisterModal] = useState(false);

    const handleOpenRegisterModal = (event: React.SyntheticEvent) => {
        event.preventDefault();
        handleCloseModal();
        setOpenRegisterModal(!openModal);
    };

    const handleCloseRegisterModal = () => {
        setOpenRegisterModal(false);
    };

    return (
        <dialog className="modal bg-black/60" open={openModal}>
            <div className="modal-box py-14 max-sm:w-full rounded-none flex items-center justify-center">
                <div className="modal-action absolute top-0 right-6">
                    <form method="dialog">
                        <button className='text-5xl font-light' onClick={handleCloseModal}>&times;</button>
                    </form>
                </div>
                <form className="flex flex-col items-center w-3/4 max-sm:w-full">
                    <h1 className="montserrat text-3xl mt-8">Вход</h1>

                    <div className="mt-14 space-y-7">
                        <input 
                            type="text" 
                            placeholder="Почта.."
                            className="w-full p-1 font-light text-xl text-gray border-b border-gray-800 outline-none"
                        />
                        <input 
                            type="text" 
                            placeholder="Пароль.."
                            className="w-full p-1 font-light text-xl text-gray border-b border-gray-800 outline-none"
                        />
                    </div>

                    <button type='submit' className="bg-black mt-20 text-white w-full h-14 text-lg">
                        Войти
                    </button>

                    <div className="mt-5 flex justify-between w-full">
                        <button className="text-gray font-light">Забыл пароль</button>
                        <button onClick={handleOpenRegisterModal} className="text-gray font-light">У меня нет аккаунта</button>
                    </div>
                </form>
            </div>

            <ModalRegister openModal={openRegisterModal} handleCloseModal={handleCloseRegisterModal}/>
        </dialog>
    );
};

export default ModalLogin;