'use client'
import { useState, useEffect } from 'react';
import { ChangeEvent, useRef } from 'react';
import { getAuthData } from '@/lib/auth';
import { fetcher  } from '@/lib/api';

import GithubIcon from '@/public/contacts-icons/bxl-github 2.svg'
import VkIcon from '@/public/contacts-icons/bxl-vk 2.svg'
import BehanceIcon from '@/public/contacts-icons/bxl-behance 2.svg'

import InputTechnology from './input-technology';
import InputSpecializations from './input-specilalizations';
import InputCourse from './input-course';
import InputPhoto from '../input-photo';
import InputText from '../input-text';
import Textarea from '../textarea';
import InputContacts from './input-contacts';


interface DataStudent {
    surname: string;
    name: string;
    patronymic?: string;
    course: number | undefined;
    specialization: string
    technologies: string
    about_info: string;
    url_github?: string;
    url_behance?: string;
    url_vk?: string;
    url_photo: any;
}


export default function FormProfileNewStudent() {

    const { id } = getAuthData();
    const { jwt } = getAuthData();

    const [selectedTechnologies, setSelectedTechnologies] = useState<number[]>([]);
    const [selectedSpecialization, setSelectedSpecialization] = useState<number>();
    const [selectedCourse, setSelectedCourse] = useState<number>();

    const [formData, setFormData] = useState<DataStudent>({
        surname: '',
        name: '',
        patronymic: '',
        course: undefined,
        specialization: '',
        about_info: '',
        technologies: '',
        url_github: '',
        url_behance: '',
        url_vk: '',
        url_photo: null
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event: React.FormEvent<any>) => {
        event.preventDefault()
        try {
            const response = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/students`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify({
                    data: {
                        published: false,
                        user: id,
                        surname: formData.surname,
                        name: formData.name,
                        patronymic: formData.patronymic,
                        course: selectedCourse,
                        specialization: selectedSpecialization,
                        about_info: formData.about_info,
                        technologies: selectedTechnologies,
                        url_github: formData.url_github,
                        url_behance: formData.url_behance,
                        url_vk: formData.url_vk,
                        url_photo: "https://college-portfolio.hb.ru-msk.vkcs.cloud/students/efim-borisov-oqLBhhhPxy0-unsplash.jpg"
                    }
                }),
            });
            console.log('adding student');
            window.location.href = `/myprofile/${id}`;
        } 
        catch (error) {
            console.error('Error adding student:', error);
        }
    };


    return (
    <div>
        <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-2 gap-16 max-lg:grid-cols-1'>
                <div className='space-y-10'>
                    <InputText placeholder={'Фамилия..'} name={'surname'} value={formData.surname} onChange={(e: any) => handleInputChange(e)}/>
                    <InputText placeholder={'Имя..'} name={'name'} value={formData.name} onChange={(e: any) => handleInputChange(e)}/>
                    <InputText placeholder={'Отчество..'} name={'patronymic'}  value={formData.patronymic} onChange={(e: any) => handleInputChange(e)}/>
                    <InputTechnology selectedTechnologies={selectedTechnologies} setSelectedTechnologies={setSelectedTechnologies}/>
                    <div className='flex gap-8 max-sm:flex-col'>
                        <InputSpecializations selectedSpecialization={selectedSpecialization} setSelectedSpecialization={setSelectedSpecialization} />
                        <InputCourse selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse}/>
                    </div>
                </div>
                <div className='h-96 max-sm:h-64'>
                    <InputPhoto />
                </div>
            </div>

            <div className='pt-14'>
                <Textarea placeholder='О себе..' name={'about_info'} required={true} value={formData.about_info} onChange={(e: any) => handleInputChange(e)}/>
            </div>

            <div className='pt-6'>
                <InputContacts srcImage={BehanceIcon} placeholder='Ссылка на Behance..' name='url_behance' value={formData.url_behance} onChange={(e: any) => handleInputChange(e)}/>
                <InputContacts srcImage={GithubIcon} placeholder='Ссылка на Github..' name='url_github' value={formData.url_github} onChange={(e: any) => handleInputChange(e)}/>
                <InputContacts srcImage={VkIcon} placeholder='Ссылка на Vk..' name='url_vk' value={formData.url_vk} onChange={(e: any) => handleInputChange(e)}/>
            </div>

            <div className='w-full flex justify-end pt-2 max-md:pt-10 max-md:justify-center'>
                <button 
                    type='submit'
                    className=" w-72 h-14 font-semibold text-lg text-white bg-zinc-900 hover:bg-white hover:text-black hover:border-black hover:border transition-all">
                        Сохранить
                </button>
            </div>
        </form>
    </div>
    );
}