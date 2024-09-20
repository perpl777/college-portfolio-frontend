'use client'
import axios from 'axios';
import { useState, useEffect } from 'react';
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

import { isNotEmpty, isLengthValid, isValidURL, checkUrls, isInRange } from '@/lib/utils/validationUtils'
import ErrorMess from '../../errorMess';


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
        photo: any;
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
    photo: any;
    published: boolean;
}

interface Props {
    studentId: number
}


export default function FormProfileEditStudent({studentId}: Props) {

    const { id } = getAuthData();
    const { jwt } = getAuthData();
    let [student, setStudent] = useState<OldDataStudent>();

    const [error, setError] = useState<string>('');
    const [selectedTechnologies, setSelectedTechnologies] = useState<number[]>([]);
    const [selectedSpecialization, setSelectedSpecialization] = useState<number>(student?.attributes?.specialization?.data?.id ?? 0);
    const [selectedCourse, setSelectedCourse] = useState<number>(student?.attributes?.course ?? 0);

    const [formDataPhoto, setFormDataPhoto] = useState<FormData | null>(null);
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
        photo: null,
        published: false
    });

    
    const dataCheck = async () => {
        let dataOk = false

        if (!isNotEmpty(formData.surname)) {
            setError('Фамилия не может быть пустой');
        } else if (!isNotEmpty(formData.name)) {
            setError('Имя не может быть пустым');
        } else if (!isInRange(selectedCourse, 1, 4)) {
            setError('Курс должен быть от 1 до 4');
        } else if (selectedSpecialization === undefined || selectedSpecialization === null) {
            setError('Специализация не может быть пустой');
        } else if (!isLengthValid(formData.about_info, 10, 500)) {
            setError('Информация о себе должна содержать от 10 до 500 символов');
        } else if (selectedTechnologies.length === 0) {
            setError('Технологии не могут быть пустыми');
        } else {
            // Проверяем доступность URL
            const urlsToCheck = {
                github: formData.url_github,
                behance: formData.url_behance,
                vk: formData.url_vk
            };
            
            // Если все проверки пройдены успешно, сбрасываем ошибку
            dataOk = true
            setError('');
        }
        return dataOk
    }


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
        setError('');
    };
    
    const handleSubmit = async (event: React.FormEvent<any>) => {
        event.preventDefault();
        if (await dataCheck()) {
            try {
                const responsePhoto = await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL_UPLOAD}`, formDataPhoto, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            
                const uploadedImage = responsePhoto.data[0];

                const response = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/students/${studentId}`, {
                    method: 'PUT', 
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`,
                    },
                    body: JSON.stringify({
                        data: {
                            published: false,
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
                            photo: uploadedImage || student?.attributes.photo,
                        }
                    }),
                });
                window.location.href = `/myprofile`;
            } 
            catch (error) {
                console.error('Error:', error);
            }
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
                <div className='h-96  mb-10 flex justify-center max-sm:h-64'>
                    <InputPhoto setFormDataPhoto={setFormDataPhoto} />
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

            <p className='pb-12 pt-9 max-sm:py-7'>Статус:  
                {student?.attributes.published ? <span className='text-green-900 pl-2'>Опубликован</span> :  <span className='text-red-900 pl-2'>На рассмотрении</span>}
            </p>
            <div className='w-full flex flex-col items-end pt-2 max-md:pt-10 max-md:items-center'>
                <div className='w-72 max-sm:w-full'>
                    {error != '' && <ErrorMess text={error}/>}
                </div>
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