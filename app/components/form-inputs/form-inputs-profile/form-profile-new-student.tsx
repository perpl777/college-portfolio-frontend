'use client'
import axios from 'axios';
import { useState } from 'react';
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
import ErrorMess from '../../errorMess';

import { isNotEmpty, isLengthValid, isValidURL, checkUrls, isInRange } from '@/lib/utils/validationUtils'


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
}


export default function FormProfileNewStudent() {

    const { id } = getAuthData();
    const { jwt } = getAuthData();

    const [error, setError] = useState<string>('');
    const [selectedTechnologies, setSelectedTechnologies] = useState<number[]>([]);
    const [selectedSpecialization, setSelectedSpecialization] = useState<number>();
    const [selectedCourse, setSelectedCourse] = useState<number>();

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
        photo: null
    });

    const dataCheck = async () => {
        let dataOk = false
        if (!isNotEmpty(formData.surname) || !isLengthValid(formData.surname, 2, 30)) {
            setError('Фамилия не может быть пустой');
        } else if (!isNotEmpty(formData.name) && !isLengthValid(formData.name, 2, 30)) {
            setError('Имя не может быть пустым');
        } else if (!isInRange(selectedCourse, 1, 4)) {
            setError('Курс должен быть от 1 до 4');
        } else if (selectedSpecialization === undefined || selectedSpecialization === null) {
            setError('Специальность не может быть пустой');
        } else if (!isLengthValid(formData.about_info, 10, 500)) {
            setError('Информация о себе должна содержать от 10 до 500 символов');
        } else if (selectedTechnologies.length === 0) {
            setError('Технологии не могут быть пустыми');
        } else if (!formDataPhoto) {
            setError('Фотография обязательна');
        }
        else {
            // Проверяем доступность URL
            const urlsToCheck = {
                github: formData.url_github,
                behance: formData.url_behance,
                vk: formData.url_vk
            };
            
            const results = checkUrls(urlsToCheck.github, urlsToCheck.behance, urlsToCheck.vk);
            
            if (!results.github || !results.behance || !results.vk) {
                let errorMessages = [];
                if (!results.github) errorMessages.push('GitHub');
                if (!results.behance) errorMessages.push('Behance');
                if (!results.vk) errorMessages.push('VK');
            
                setError(`Некорректная ссылка для: ${errorMessages.join(', ')}`);
                return;
            }
            dataOk = true
            setError('');
        }
        return dataOk
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setError('');
    };

    const handleSubmit = async (event: React.FormEvent<any>) => {
        event.preventDefault()
        if(await dataCheck()) {
            try {
                let uploadedImage;
                console.log('uploadedImage')
                if (formDataPhoto) {
                    console.log('formDataPhoto')
                    const responsePhoto = await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL_UPLOAD}`, formDataPhoto, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    uploadedImage = responsePhoto.data[0];
                }
    
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
                            course: selectedCourse,
                            specialization: selectedSpecialization,
                            about_info: formData.about_info,
                            technologies: selectedTechnologies,
                            ...(formData.url_github && { url_github: formData.url_github }),
                            ...(formData.url_behance && { url_behance: formData.url_behance }),
                            ...(formData.url_vk && { url_vk: formData.url_vk }),
                            ...(formData.patronymic && { patronymic: formData.patronymic }),
                            ...(uploadedImage && { photo: uploadedImage })
                        }
                    }),
                });
                
                window.location.href = `/myprofile/${id}`;
            } 
            catch (error) {
                console.error('Error adding student:', error);
            }
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
                <div className='h-96  mb-10 flex justify-center max-sm:h-64'>
                    <InputPhoto setFormDataPhoto={setFormDataPhoto} existingPhoto={null} />
                </div>
            </div>

            <div className='pt-16'>
                <Textarea placeholder='О себе..' name={'about_info'} required={true} value={formData.about_info} onChange={(e: any) => handleInputChange(e)}/>
            </div>

            <div className='pt-6'>
                <InputContacts srcImage={BehanceIcon} placeholder='Ссылка на Behance..' name='url_behance' value={formData.url_behance} onChange={(e: any) => handleInputChange(e)}/>
                <InputContacts srcImage={GithubIcon} placeholder='Ссылка на Github..' name='url_github' value={formData.url_github} onChange={(e: any) => handleInputChange(e)}/>
                <InputContacts srcImage={VkIcon} placeholder='Ссылка на Vk..' name='url_vk' value={formData.url_vk} onChange={(e: any) => handleInputChange(e)}/>
            </div>

            <div className='w-full flex flex-col items-end pt-2 max-md:pt-6 max-md:items-center'>
                <div className='w-72 max-sm:w-full'>
                    {error != '' && <ErrorMess text={error}/>}
                </div>
                <button 
                    type='submit'
                    className=" w-72 h-14 max-sm:w-full font-semibold text-lg text-white bg-zinc-900 hover:bg-white hover:text-black hover:border-black hover:border transition-all">
                        Сохранить
                </button>
            </div>
        </form>
    </div>
    );
}