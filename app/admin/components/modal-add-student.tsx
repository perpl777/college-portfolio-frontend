'use client'
import React, {useState, useEffect} from 'react';
import {getAuthData} from "@/lib/auth"
import {fetcher} from "@/lib/api"
import { ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import GithubIcon from '@/public/contacts-icons/bxl-github 2.svg'
import VkIcon from '@/public/contacts-icons/bxl-vk 2.svg'
import BehanceIcon from '@/public/contacts-icons/bxl-behance 2.svg'



interface ModalProps {
    openModal: boolean;
    handleCloseModal: () => void;
}


interface DataStudent {
    surname: string;
    name: string;
    patronymic?: string;
    course: number | undefined;
    specialty: string;
    description: string;
    technologies: string;
    linkToGit?: string;
    linkToBehance?: string;
    linkToVK?: string;
    profilePicture: any;
}

interface UserData {
    course: number;
    specialty: {
        name: string
    }
}


const ModalAddStudent = ({ openModal, handleCloseModal}: ModalProps) => {

    const { id } = getAuthData();
    const { jwt } = getAuthData();
    let [userData, setUserData] = useState<UserData>();

    useEffect(() => {     
        const fetchData = async () => {     
            const userDataResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/${id}?populate=*`);
            setUserData(userDataResponse)
        };
        fetchData();   
    }, []);

    const [formData, setFormData] = useState<DataStudent>({
        surname: '',
        name: '',
        patronymic: '',
        course: undefined,
        specialty: '',
        description: '',
        technologies: '',
        linkToGit: '',
        linkToBehance: '',
        linkToVK: '',
        profilePicture: null
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    
    const handleInputChange = (event: React.ChangeEvent<any>) => {
        const { name } = event.target;
        setFormData({
            ...formData,
            [name]: event.target.value,
        });
    };

    const handleSubmit = async (event: React.FormEvent<any>) => {
        event.preventDefault()
        if (!blob) {
            return;
        }
        try {
            const response = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/students`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify({
                    data: {
                        surname: formData.surname,
                        name: formData.name,
                        patronymic: formData.patronymic,
                        course: parseInt(`${userData?.course}`),
                        specialty: userData?.specialty.name,
                        description: formData.description,
                        technologies: formData.technologies,
                        linkToGit: formData.linkToGit,
                        linkToBehance: formData.linkToBehance,
                        linkToVK: formData.linkToVK,
                    }
                }),
            });
            console.log('adding student');
        } 
        catch (error) {
            console.error('Error adding student:', error);
        }
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [blob, setBlob] = useState<Blob | null>(null);

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }
        setBlob(file);
    };
    
    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <dialog className="modal bg-black/30" open={openModal}>
            <div className="modal-box w-11/12 max-w-5xl p-10 rounded-none">
                <div className="modal-action absolute top-0 right-4">
                    <form method="dialog">
                        <button className='text-5xl font-light' onClick={handleCloseModal}>&times;</button>
                    </form>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className='flex gap-10 justify-between mt-12 mb-10 max-lg:flex-col max-lg:items-center'>
                        <div className='flex flex-col flex-auto max-lg:w-full'>    
                            <label className="my-5 border-b border-gray-500 flex gap-2 items-center w-full">
                                <input 
                                    type="text" 
                                    name="surname"
                                    className="grow outline-none p-2 w-full" 
                                    placeholder={'Фамилия..'}
                                    value={formData.surname}
                                    onChange={(e) => handleInputChange(e)}
                                />
                            </label>
                            <label className="my-5 border-b border-gray-500 flex gap-2 items-center w-full">
                                <input 
                                    type="text" 
                                    name="name"
                                    className="grow outline-none p-2 w-full" 
                                    placeholder={'Имя..'}
                                    value={formData.name}
                                    onChange={(e) => handleInputChange(e)}
                                />
                            </label>
                            <label className="my-5 border-b border-gray-500 flex gap-2 items-center w-full">
                                <input 
                                    type="text" 
                                    name="patronymic"
                                    className="grow outline-none p-2 w-full" 
                                    placeholder={'Отчество..'}
                                    value={formData.patronymic}
                                    onChange={(e) => handleInputChange(e)}
                                />
                            </label>
                            <label className="my-5 border-b border-gray-500 flex gap-2 items-center w-full">
                                <input 
                                    type="text" 
                                    name="technologies"
                                    className="grow outline-none p-2 w-full" 
                                    placeholder={'Технологии..'}
                                    value={formData.technologies}
                                    onChange={(e) => handleInputChange(e)}
                                />
                            </label>
                            <label className="my-5 border-b border-gray-500 flex gap-2 items-center w-full">
                                <input 
                                    type="text" 
                                    name="course"
                                    className="grow outline-none p-2 w-full" 
                                    placeholder={`${userData?.course}`} 
                                    disabled
                                />
                            </label>
                            <label className="my-5 border-b border-gray-500 flex gap-2 items-center w-full">
                                <input 
                                    type="text" 
                                    name="specialty"
                                    className="grow outline-none p-2 w-full" 
                                    placeholder={`${userData?.specialty.name}`} 
                                    disabled
                                />
                            </label>
                        </div>

                        <div className='w-1/2 max-md:w-11/12'>
                            <div className={`flex items-center justify-center w-full border border-gray-500 ml-5 mb-5`} style={{ minHeight: '300px' }}>
                                <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} />
                                <div className="absolute" onClick={handleClick}>
                                    <button className="w-48 bg-white h-11 border rounded-[4px] border-gray-500  font-semibold text-base text-black hover:bg-black hover:text-white transition-all">
                                    Выбрать файл
                                    </button>
                                </div>
                                <div className='overflow-hidde flex justify-center items-center' style={{ minHeight: '300px' }}>
                                    {blob ? (
                                    <img className='object-cover' src={blob ? URL.createObjectURL(blob) : ''} alt='uploaded' />
                                    ) : (
                                    <div style={{ height: '100%' }}/>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <label className="my-5 border border-gray-500 flex gap-2 items-center  w-full">
                        <textarea 
                            name="description"
                            className="grow outline-none px-5 pt-5 rounded-sm" 
                            placeholder={'О себе..'} 
                            style={{ whiteSpace: "nowrap", overflow: "hidden" }}
                            value={formData.description}
                            onChange={(e) => handleInputChange(e)}
                        />
                    </label>

                    <div className='flex flex-col'>
                        <div className='flex w-96 gap-4 max-sm:w-64'>
                            <Image src={GithubIcon} alt="github" />
                            <label className="my-5 border-b border-gray-500 flex gap-2 items-center w-full">
                                <input 
                                    type="text" 
                                    name="linkToGit"
                                    className="grow outline-none p-2 w-full" 
                                    placeholder={'Ссылка на Github..'}
                                    value={formData.linkToGit}
                                    onChange={(e) => handleInputChange(e)}
                                />
                            </label>
                        </div>
                        <div className='flex w-96 gap-4 max-sm:w-64'>
                            <Image src={VkIcon} alt="vk"></Image>
                            <label className="my-5 border-b border-gray-500 flex gap-2 items-center w-full">
                                <input 
                                    type="text" 
                                    name="linkToVK"
                                    className="grow outline-none p-2 w-full" 
                                    placeholder={'Ссылка на VK..'}
                                    value={formData.linkToVK}
                                    onChange={(e) => handleInputChange(e)}
                                />
                            </label>
                        </div>
                        <div className='flex w-96 gap-4 max-sm:w-64'>
                            <Image src={BehanceIcon} alt="behance"></Image>
                            <label className="my-5 border-b border-gray-500 flex gap-2 items-center w-full">
                                <input 
                                    type="text" 
                                    name="linkToBehance"
                                    className="grow outline-none p-2 w-full" 
                                    placeholder={'Ссылка на Behance..'}
                                    value={formData.linkToBehance}
                                    onChange={(e) => handleInputChange(e)}
                                />
                            </label>
                        </div>
                    </div>

                    <div className='w-full flex justify-center pt-12'>
                        <button 
                            type='submit'
                            onClick={handleCloseModal}
                            className=" w-72 h-14 font-semibold text-lg text-white bg-black hover:bg-white hover:text-black hover:border-black hover:border transition-all">
                                Сохранить
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};

export default ModalAddStudent;