'use client'
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
import type { DataStudent, OldDataPost } from '../components/interfaces'
import { useUser } from '../components/context';

export default function EditPostPage() {

    const { id, jwt } = useUser();

    let [post, setPost] = useState<OldDataPost>();

    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [selectedWorktype, setSelectedWorktype] = useState<number>(post?.attributes.worktype?.data?.id ?? 0);

    const [formData, setFormData] = useState<DataStudent>({
        title: '',
        description: '',
        tags: '',
        worktype: '',
        background: false,
        url_file: '',
        url_view: null
    });


     //фетч
    useEffect(() => {     
        const fetchData = async () => {       
            const postResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/posts/${id}?populate=*`);
            setPost(postResponse.data);
        };
        fetchData();   
    }, []);


    useEffect(() => {
        if (post?.attributes.worktype) {
            setSelectedWorktype(post?.attributes.worktype?.data?.id);
        }
        if (post?.attributes.tags) {
            const selectTags = post.attributes.tags.data.map((tags: { id: number }) => tags.id);
            setSelectedTags(selectTags);
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
            const response = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/posts/${id}`, {
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
                        url_file: 'https://college-portfolio.hb.ru-msk.vkcs.cloud/posts/sam-moghadam-khamseh-s8wknXs_O7U-unsplash.jpg',
                        url_view: "https://college-portfolio.hb.ru-msk.vkcs.cloud/posts/sam-moghadam-khamseh-s8wknXs_O7U-unsplash.jpg"
                    }
                }),
            });
            window.location.href = `/myprofile`;
        } 
        catch (error) {
            console.error('Error', error);
        }
    };
    
    return (
    <div className='pb-10'>
        <Header />
        <div className='px-11 pt-14 pb-8 max-sm:p-6 max-sm:pt-12 max-sm:pb-4'>
            <Link href={`#${id}`} onClick={() => window.history.back()}>
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
                    <InputFile />
                </div>
                <div className='h-96 max-sm:h-64'>
                    <InputPhoto />
                    <div className='flex justify-end my-5'>
                        <CheckDiploma name={'background'} checked={formData.background} onChange={(e: any) => setFormData({ ...formData, background: e.target.checked })}/>
                    </div>
                </div>
            </div>
            <p className='pt-16 max-sm:pt-32'>Статус:  
                {post?.attributes.published === false &&
                    <span className='text-yellow-500 pl-2'>На рассмотрении</span> 
                }
                {post?.attributes.published === null && 
                    <span className='text-blue-900 pl-2'>Отклонен</span>
                }
                {post?.attributes.published &&
                    <span className='text-green-900 pl-2'>Опубликован</span> 
                }
            </p>
            <div className='w-full flex justify-end pt-12  max-md:justify-center'>
                <button 
                    type='submit'
                    className=" w-72  h-14 font-semibold text-lg text-white bg-zinc-900 hover:bg-white hover:text-black hover:border-black hover:border transition-all">
                        Сохранить
                </button>
            </div>
        </form>
    </div>
    );
}