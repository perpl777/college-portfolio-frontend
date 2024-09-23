'use client'
import axios from 'axios';
import { useState, useEffect, Suspense } from 'react';
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
import Loading from '@/app/loading';


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
        photo?: {
            data: {
                id: number;
                attributes: {
                    name: string;
                    url: string
                }
            }
        }
        file?: {
            data: {
                id: number;
                attributes: {
                    name: string;
                    url: string
                }
            }
        }
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

    const [formData, setFormData] = useState<DataStudent>({
        title: '',
        description: '',
        tags: '',
        worktype: '',
        background: false,
        photo: null,
        file: null
    });

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
        try {
            let uploadedImage;
            let uploadedFile;

            if (formDataPhoto) {
                const responsePhoto = await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL_UPLOAD}`, formDataPhoto, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                uploadedImage = responsePhoto.data[0];
            }

            if (formDataFile) {
                const responseFile = await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL_UPLOAD}`, formDataFile, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                uploadedFile = responseFile.data[0];
            }

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
                        ...(uploadedImage && { photo: uploadedImage }),
                        ...(uploadedFile && { file: uploadedFile }),
                    }
                }),
            });
            window.location.href = `/myprofile/${id}`;
        } 
        catch (error) {
            console.error('Error', error);
        }
    };
    
    return (
    <Suspense fallback={<Loading />}>
        <div className='pb-10'>
            <Header />
            <div className='px-11 pt-14 pb-8 max-sm:p-6 max-sm:pt-12 max-sm:pb-4'>
                <Link href={`#${postId}`} onClick={() => window.history.back()}>
                    <Image src={ArrowIcon} alt="Arrow Icon" width={25} />
                </Link>
            </div>
            <form onSubmit={handleSubmit} className='px-11 py-10 max-sm:p-6'>
                <div className='grid grid-cols-2 gap-6 max-lg:grid-cols-1'>
                    <div className='space-y-10'>
                        <InputText placeholder={post?.attributes.title ? post?.attributes.title : 'Название..'} name={'title'} value={formData.title} onChange={(e: any) => handleInputChange(e)}/>
                        <Textarea placeholder={post?.attributes.description ? post?.attributes.description : 'Описание..'} name={'description'} required={true} value={formData.description} onChange={(e: any) => handleInputChange(e)}/>
                        <InputWorktype selectedWorktype={selectedWorktype} setSelectedWorktype={setSelectedWorktype}/>
                        <InputTags selectedTags={selectedTags} setSelectedTags={setSelectedTags}/>
                        <InputFile setFormDataFile={setFormDataFile} existingFile={post?.attributes.file?.data?.attributes?.name} />
                    </div>
                    <div className='h-96 max-sm:h-64'>
                        <InputPhoto setFormDataPhoto={setFormDataPhoto} existingPhoto={post?.attributes.photo?.data?.attributes?.url} />
                        <div className='flex justify-end my-2'>
                            <CheckDiploma name={'background'} checked={formData.background} onChange={(e: any) => setFormData({ ...formData, background: e.target.checked })}/>
                        </div>
                    </div>
                </div>
                <p className='pt-16 max-sm:pt-40'>Статус:  
                    {post?.attributes.published === false &&
                        <span className='text-yellow-700 pl-2'>На рассмотрении</span> 
                    }
                    {post?.attributes.published === null && 
                        <span className='text-blue-800 pl-2'>Отклонен</span>
                    }
                    {post?.attributes.published &&
                        <span className='text-green-700 pl-2'>Опубликован</span> 
                    }
                </p>
                <div className='w-full flex justify-end max-sm:pt-10 max-md:justify-center'>
                    <button 
                        type='submit'
                        className=" w-72 max-sm:w-full h-14 font-semibold text-lg text-white bg-zinc-900 hover:bg-white hover:text-black hover:border-black hover:border transition-all">
                            Сохранить
                    </button>
                </div>
            </form>
        </div>
    </Suspense>
        
    );
}