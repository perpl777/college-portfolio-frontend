import React, { useState } from 'react';
import Image from 'next/image';
import InputPhoto from '../inputs/input-photo';
import InputText from '../inputs/input-text';
import Textarea from '../inputs/textarea';
import GithubIcon from '@/public/contacts-icons/bxl-github 2.svg'
import VkIcon from '@/public/contacts-icons/bxl-vk 2.svg'
import BehanceIcon from '@/public/contacts-icons/bxl-behance 2.svg'

interface FormProfileProps {
    surname: string,
    name: string,
    patronymic?: string,
    description: string,
    course?: number,
    specialty?: string,
    technologies: string,
    linkToGit?: string,
    linkToBehance?: string,
    linkToVK?: string,
    profilePicture: string,
    handleClose: any
}

//для страницы редактрования студента. можно потом удалить форму и сделать как в добавлении

const FormProfile = ({surname, name, patronymic, description, course, specialty, technologies, linkToGit, linkToBehance, linkToVK, profilePicture, handleClose}: FormProfileProps) => {
    const [formData, setFormData] = useState({
        surname,
        name,
        patronymic,
        description,
        technologies,
        linkToGit,
        linkToBehance,
        linkToVK,
        profilePicture
    });

    return (
        <form>
            <div className='flex gap-10 justify-between mt-12 mb-10 max-lg:flex-col max-lg:items-center'>
                <div className='flex flex-col flex-auto max-lg:w-full'>    
                    <InputText placeholder="Фамилия.." value={formData.surname} disabled={false}/>
                    <InputText placeholder="Имя.." value={formData.name} disabled={false}/>
                    <InputText placeholder="Отчество.." value={formData.patronymic} disabled={false}/>
                    <InputText placeholder="Технологии.." value={formData.technologies} disabled={false}/>
                    <InputText placeholder={`${course} курс`} value={''} disabled={true}/>
                    <InputText placeholder={`${specialty}`} value={''} disabled={true}/>
                </div>
                <div className='w-1/2 max-md:w-11/12'>
                    <InputPhoto value={formData.profilePicture}/>
                </div>
            </div>

            <Textarea placeholder="О себе.." value={formData.description}/>

            <div className='flex flex-col'>
                <div className='flex w-96 gap-4 max-sm:w-64'>
                    <Image src={GithubIcon} alt="github" />
                    <InputText placeholder="Ссылка на Github" value={formData.linkToGit}  disabled={false}/>
                </div>
                <div className='flex w-96 gap-4 max-sm:w-64'>
                    <Image src={VkIcon} alt="vk"></Image>
                    <InputText placeholder="Ссылка на Behance" value={formData.linkToBehance} disabled={false}/>
                </div>
                <div className='flex w-96 gap-4 max-sm:w-64'>
                    <Image src={BehanceIcon} alt="behance"></Image>
                    <InputText placeholder="Ссылка на VK" value={formData.linkToVK} disabled={false}/>
                </div>
            </div>

            <div className='w-full flex justify-center pt-12'>
                <button 
                    onClick={handleClose}
                    className=" w-72 h-14 font-semibold text-lg text-white bg-black hover:bg-white hover:text-black hover:border-black hover:border transition-all">
                        Сохранить
                </button>
            </div>
        </form>
    );
}

export default FormProfile;