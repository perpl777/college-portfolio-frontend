'use client'
import { useState } from 'react';
import { getAuthData } from '@/lib/auth';
import { fetcher  } from '@/lib/api';

import ArrowIcon from '@/public/Arrow.svg'
import Link from 'next/link';
import Image from 'next/image';

import InputPhoto from '@/app/components/form-inputs/input-photo';
import InputText from '@/app/components/form-inputs/input-text';
import Textarea from '@/app/components/form-inputs/textarea';
import InputWorktype from '@/app/components/form-inputs/form-inputs-post/input-worktype';
import InputTags from '@/app/components/form-inputs/form-inputs-post/input-tags';
import InputFile from '@/app/components/form-inputs/form-inputs-post/input-file';
import CheckDiploma from '@/app/components/form-inputs/form-inputs-post/checkDiploma';
import Header from '@/app/components/header';

import { isNotEmpty, isLengthValid, isValidURL, checkUrls, isInRange } from '@/lib/utils/validationUtils'
import ErrorMess from '@/app/components/errorMess';


interface DataStudent {
    title: string;
    description: string;
    tags: string;
    worktype: string
    background: boolean
    url_file?: string;
    url_view: any;
}


interface Props {
    params: {
        studentId: number
    }
}


export default function AddPostPage({ params: {studentId}}: Props) {

    const { id } = getAuthData();
    const { jwt } = getAuthData();

    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [selectedWorktype, setSelectedWorktype] = useState<number>();
    const [error, setError] = useState<string>('');

    const [formData, setFormData] = useState<DataStudent>({
        title: '',
        description: '',
        tags: '',
        worktype: '',
        background: false,
        url_file: '',
        url_view: null
    });

    const dataCheck = async () => {
        let dataOk = false

        if (!isNotEmpty(formData.title)) {
            setError('Название не может быть пустым');
        } else if (!isLengthValid(formData.description, 10, 10000)) {
            setError('Описание должно содержать больше символов');
        } else if (selectedTags.length === 0) {
            setError('Теги не могут быть пустым');
        } else if (!selectedWorktype) {
            setError('Вы должны выбрать тип работы');
        } else if (formData.url_file && !isValidURL(formData.url_file)) {
            setError('Некорректно загружен файл, попробуйте снова');
        } else if (!isValidURL(formData.url_view)) {
            setError('Некорректно загружено фото, попробуйте снова');
        } else {
            // Если все проверки пройдены успешно, сбрасываем ошибку
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
        if (await dataCheck()) {
            try {
                const response = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/posts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`,
                    },
                    body: JSON.stringify({
                        data: {
                            published: false,
                            student: studentId,
                            title: formData.title,
                            description: formData.description,
                            tags: selectedTags,
                            worktype: selectedWorktype,
                            background: formData.background,
                            url_file: 'https://college-portfolio.hb.ru-msk.vkcs.cloud/posts/sam-moghadam-khamseh-s8wknXs_O7U-unsplash.jpg',
                            url_view: "https://college-portfolio.hb.ru-msk.vkcs.cloud/posts/sam-moghadam-khamseh-s8wknXs_O7U-unsplash.jpg"
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
    <div className='pb-10'>
        <Header />
        <div className='px-11 pt-12 pb-5 max-sm:px-6 max-sm:pt-12'>
            <Link href={`#${studentId}`} onClick={() => window.history.back()}>
                <Image src={ArrowIcon} alt="Arrow Icon" width={25} />
            </Link>
        </div>
        <form onSubmit={handleSubmit} className='px-11 py-10 max-sm:p-6'>
            <div className='grid grid-cols-2 gap-16 max-lg:grid-cols-1'>
                <div className='space-y-10'>
                    <InputText placeholder={'Название..'} name={'title'} value={formData.title} onChange={(e: any) => handleInputChange(e)}/>
                    <Textarea placeholder='Описание..' name={'description'} required={true} value={formData.description} onChange={(e: any) => handleInputChange(e)}/>
                    <InputWorktype selectedWorktype={selectedWorktype} setSelectedWorktype={setSelectedWorktype}/>
                    <InputTags selectedTags={selectedTags} setSelectedTags={setSelectedTags}/>
                    <InputFile />
                </div>
                <div className='h-96 max-sm:h-64'>
                    <InputPhoto />
                    <div className='flex justify-end my-5'>
                        <CheckDiploma name={'background'} checked={formData.background} onChange={(e: any) => setFormData({ ...formData, background: e.target.checked })}/>
                    </div>
                </div>
            </div>
            <div className='w-full flex flex-col items-end pt-20 max-md:pt-32 max-md:items-center'>
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