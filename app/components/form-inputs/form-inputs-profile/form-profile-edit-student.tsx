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
import InputText from './input-text';
import Textarea from '../textarea';
import InputContacts from './input-contacts';



interface OldDataStudent {
    id: number,
    attributes: {
        surname: string,
        name: string,
        patronymic: string
        course: number,
        about_info: string,
        published: boolean,
        technologies: {
            data: Technology[];
        },
        url_behance?: string,
        url_github?: string,
        url_vk?: string,
        specialization: {
            data: {
                id: number
                attributes: {
                    name: string
                }
            }
        },
        url_photo?: string,
    }
}

interface Technology {
    id: number;
    attributes: {
        name: string;
    };
}

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

interface Props {
    studentId: number
}


export default function FormProfileEditStudent({studentId}: Props) {

    const { id } = getAuthData();
    const { jwt } = getAuthData();
    let [student, setStudent] = useState<OldDataStudent>();

    const [selectedTechnologies, setSelectedTechnologies] = useState<number[]>([]);
    const [selectedSpecialization, setSelectedSpecialization] = useState<number>(student?.attributes?.specialization?.data?.id ?? 0);
    const [selectedCourse, setSelectedCourse] = useState<number>(student?.attributes?.course ?? 0);

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

     //фетч
    useEffect(() => {     
        const fetchData = async () => {       
            const studentsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/students/${studentId}?populate=*`);
            setStudent(studentsResponse.data);
        };
        fetchData();   
    }, []);

    useEffect(() => {
        if (student?.attributes?.technologies?.data) {
            const selectedTechIds = student.attributes.technologies.data.map((tech: { id: number }) => tech.id);
            setSelectedTechnologies(selectedTechIds);
        }
    }, [student]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    
    const handleSubmit = async (event: React.FormEvent<any>) => {
        event.preventDefault();
        try {
            const response = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/students/${studentId}`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify({
                    data: {
                        user: id,
                        surname: formData.surname || student?.attributes.surname,
                        name: formData.name || student?.attributes.name,
                        patronymic: formData.patronymic || student?.attributes.patronymic,
                        course: selectedCourse || student?.attributes.course,
                        specialization: selectedSpecialization || student?.attributes.specialization,
                        about_info: formData.about_info || student?.attributes.about_info,
                        technologies: selectedTechnologies || student?.attributes.technologies,
                        url_github: formData.url_github || student?.attributes.url_github,
                        url_behance: formData.url_behance || student?.attributes.url_behance,
                        url_vk: formData.url_vk || student?.attributes.url_vk,
                        url_photo: "https://college-portfolio.hb.ru-msk.vkcs.cloud/students/efim-borisov-oqLBhhhPxy0-unsplash.jpg"
                    }
                }),
            });
            console.log('edit student');
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
                    <InputText placeholder={student?.attributes.surname ? student?.attributes.surname : 'Фамилия..'} name={'surname'} value={formData.surname} onChange={(e: any) => handleInputChange(e)}/>
                    <InputText placeholder={student?.attributes.name ? student?.attributes.name :  'Имя..'} name={'name'} value={formData.name} onChange={(e: any) => handleInputChange(e)}/>
                    <InputText placeholder={student?.attributes.patronymic ? student?.attributes.patronymic :  'Отчество..'} name={'patronymic'}  value={formData.patronymic} onChange={(e: any) => handleInputChange(e)}/>
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
                <Textarea placeholder={student?.attributes.about_info ? student?.attributes.about_info :  'О себе..'} name={'about_info'} required={true} value={formData.about_info} onChange={(e: any) => handleInputChange(e)}/>
            </div>

            <div className='pt-6'>
                <InputContacts srcImage={BehanceIcon} placeholder={student?.attributes.url_behance ? student?.attributes.url_behance : 'Ссылка на Behance..'} name='url_behance' value={formData.url_behance} onChange={(e: any) => handleInputChange(e)}/>
                <InputContacts srcImage={GithubIcon} placeholder={student?.attributes.url_github ? student?.attributes.url_github : 'Ссылка на Github..'} name='url_github' value={formData.url_github} onChange={(e: any) => handleInputChange(e)}/>
                <InputContacts srcImage={VkIcon} placeholder={student?.attributes.url_vk ? student?.attributes.url_vk : 'Ссылка на Vk..'} name='url_vk' value={formData.url_vk} onChange={(e: any) => handleInputChange(e)}/>
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