'use client'
import axios from 'axios';
import { useState, useEffect } from 'react';
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
import { isLengthValid, isNotEmpty, isValidURL } from '@/lib/utils/validationUtils';
import ErrorMess from '@/app/components/errorMess';


interface DataStudent {
    title: string;
    description: string;
    tags: string;
    worktype: string
    background: boolean
    photo: any;
    file: any;
}

interface OldDataPost {
    id: number;
    attributes: {
        title: string;
        description?: string;
        tags: {
            data: Tags[];
        }
        worktype: {
            data: {
                id: number;
                attributes: {
                    name: string
                }
            }
        }
        background: boolean
        photo?: any;
        file?: any;
        published: boolean
    }
}

interface Tags {
    id: number;
    attributes: {
        name: string;
    };
}

interface Props {
    params: {
        postId: number
    }
}


export default function EditPostPage({ params: {postId}}: Props) {

    const { id } = getAuthData();
    const { jwt } = getAuthData();
    let [post, setPost] = useState<OldDataPost>();

    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [selectedWorktype, setSelectedWorktype] = useState<number>(post?.attributes.worktype?.data?.id ?? 0);
    const [formDataPhoto, setFormDataPhoto] = useState<FormData | null>(null);
    const [formDataFile, setFormDataFile] = useState<FormData | null>(null);
    const [error, setError] = useState<string>('');

    const [formData, setFormData] = useState<DataStudent>({
        title: '',
        description: '',
        tags: '',
        worktype: '',
        background: false,
        photo: null,
        file: null
    });

    const dataCheck = async () => {
        let dataOk = false

        if (formData.title && !isLengthValid(formData.title, 1, 100)) {
            setError('Название не может быть пустым');
        } else if (formData.description && !isLengthValid(formData.description, 10, 10000)) {
            setError('Описание должно содержать больше символов');
        } else if (!selectedWorktype) {
            setError('Вы должны выбрать тип работы');
        } else if (selectedTags.length === 0) {
            setError('Теги не могут быть пустым');
        } else {
            // Если все проверки пройдены успешно, сбрасываем ошибку
            dataOk = true
            setError('');
        }
        return dataOk
    }


     //фетч
    useEffect(() => {     
        const fetchData = async () => {       
            const postResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/posts/${postId}?populate=*`);
            setPost(postResponse.data);
        };
        fetchData();   
    }, []);


    useEffect(() => {
        if (post?.attributes.tags) {
            const selectedTechIds = post.attributes.tags.data.map((tags: { id: number }) => tags.id);
            setSelectedTags(selectedTechIds);
        }
    }, [post]);


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };


    const handleSubmit = async (event: React.FormEvent<any>) => {
        event.preventDefault()
        if (await dataCheck()) {
            try {
                const responsePhoto = await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL_UPLOAD}`, formDataPhoto, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            
                const uploadedImage = responsePhoto.data[0];
    
                const responseFile = await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL_UPLOAD}`, formDataFile, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
    
                const uploadedFile = responseFile.data[0];
                const response = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/posts/${postId}`, {
                    method: 'PUT', 
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`,
                    },
                    body: JSON.stringify({
                        data: {
                            published: false,
                            title: formData.title || post?.attributes.title,
                            description: formData.description || post?.attributes.description,
                            tags: selectedTags || post?.attributes.tags,
                            worktype: selectedWorktype || post?.attributes.worktype,
                            background: formData.background || post?.attributes.background,
                            photo: uploadedImage,
                            file: uploadedFile,
                        }
                    }),
                });
                window.location.href = `/myprofile/${id}`;
            } 
            catch (error) {
                console.error('Error', error);
            }
        }
    };
    
    return (
    <div className='pb-10'>
        <Header />
        <div className='px-11 pt-14 pb-8 max-sm:p-6 max-sm:pt-12 max-sm:pb-4'>
            <Link href={`#${postId}`} onClick={() => window.history.back()}>
                <Image src={ArrowIcon} alt="Arrow Icon" width={25} />
            </Link>
        </div>
        <form onSubmit={handleSubmit} className='px-11 py-10 max-sm:p-6'>
            <div className='grid grid-cols-2 gap-16 max-lg:grid-cols-1'>
                <div className='space-y-10'>
                    <InputText placeholder={post?.attributes.title ? post?.attributes.title : 'Название..'} name={'title'} value={formData.title} onChange={(e: any) => handleInputChange(e)}/>
                    <Textarea placeholder={post?.attributes.description ? post?.attributes.description : 'Описание..'} name={'description'} required={true} value={formData.description} onChange={(e: any) => handleInputChange(e)}/>
                    <InputWorktype selectedWorktype={selectedWorktype} setSelectedWorktype={setSelectedWorktype}/>
                    <InputTags selectedTags={selectedTags} setSelectedTags={setSelectedTags}/>
                    <InputFile setFormDataFile={setFormDataFile} />
                </div>
                <div className='h-96 max-sm:h-64'>
                    <InputPhoto setFormDataPhoto={setFormDataPhoto} />
                    <div className='flex justify-end my-5'>
                        <CheckDiploma name={'background'} checked={formData.background} onChange={(e: any) => setFormData({ ...formData, background: e.target.checked })}/>
                    </div>
                </div>
            </div>
            <p className='pt-16 max-sm:pt-32'>Статус:  
                {post?.attributes.published ? <span className='text-green-900 pl-2'>Опубликован</span> :  <span className='text-blue-900 pl-2'>На рассмотрении</span>}
            </p>
            <div className='w-full flex flex-col items-end  max-md:items-center'>
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