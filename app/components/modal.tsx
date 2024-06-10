

interface ModalProps {
    props: {
        title: string;
        inputText: any;
        btnText: string;
    };
    openModal: boolean;
    handleCloseModal: () => void;
}


const Modal = ({ props, openModal, handleCloseModal}: ModalProps) => {

    return (
        <dialog className="modal bg-black/60" open={openModal}>
            <div className="modal-box py-14 max-sm:w-full rounded-none flex items-center justify-center">
                <div className="modal-action absolute top-0 right-6">
                    <form method="dialog">
                        <button className='text-5xl font-light' onClick={handleCloseModal}>&times;</button>
                    </form>
                </div>
                <form className="flex flex-col items-center w-3/4 max-sm:w-full">
                    <h1 className="montserrat text-3xl mt-8">{props.title}</h1>

                    <div className="mt-10 space-y-7">
                        {props.inputText.map((input: string) => {
                            return(
                                <input 
                                    type="text" 
                                    placeholder={input} 
                                    className="w-full p-1 font-light text-xl text-gray border-b border-gray-800 outline-none"
                                />
                        )})} 
                    </div>

                    <button type='submit' className="bg-black mt-16 text-white w-full h-14 text-lg">
                        {props.btnText}
                    </button>

                    {props.btnText === "Войти"
                    ?
                        <div className="mt-5 flex justify-between w-full">
                            <button className="text-gray font-light">Забыл пароль</button>
                            <button className="text-gray font-light">У меня нет аккаунта</button>
                        </div>
                    :
                        <></>
                    }
                </form>
            </div>
        </dialog>
    );
};

export default Modal;