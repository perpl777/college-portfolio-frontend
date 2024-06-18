import React from "react";
import ModalLogin from "./modalLogin";
import ModalRegister from "./modalRegister";
import ModalRecovery from "./modalRecovery"


interface ModalsProps {
    openModalLogin: boolean;
    setOpenModalLogin: any;
    handleOpenModalLogin: any
    handleCloseModalLogin: () => void;
    openModalRegister: boolean;
    setOpenModalRegister: any;
    openModalRecovery: boolean;
    setOpenModalRecovery: any;
}


const Modals = ({
        openModalLogin, 
        setOpenModalLogin, 
        handleOpenModalLogin, 
        handleCloseModalLogin,
        openModalRegister,
        setOpenModalRegister,
        openModalRecovery,
        setOpenModalRecovery
    }: ModalsProps) => {


    const handleOpenModalRegister = () => {
        setOpenModalLogin(false)
        setOpenModalRegister(!openModalRegister);
    };

    const handleCloseModalRegister = () => {
        setOpenModalRegister(false);
    };

    const handleOpenModalRecovery = () => {
        setOpenModalLogin(false)
        setOpenModalRecovery(!openModalRecovery);
    };

    const handleCloseModalRecovery = () => {
        setOpenModalRecovery(false);
    };

    return (
        <>
            <ModalLogin 
                openModalLogin={openModalLogin}
                handleCloseModalLogin={handleCloseModalLogin}
                handleOpenModalRegister={handleOpenModalRegister}
                handleOpenModalRecovery={handleOpenModalRecovery}
            />
            <ModalRegister
                openModalRegister={openModalRegister}
                handleCloseModalRegister={handleCloseModalRegister}
                handleOpenModalLogin={handleOpenModalLogin}
            />
            <ModalRecovery 
                openModalRecovery={openModalRecovery}
                handleCloseModalRecovery={handleCloseModalRecovery}
                handleOpenModalLogin={handleOpenModalLogin}
            />
        </>
    );
};

export default Modals;