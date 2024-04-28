'use client'
import React, { useState, useEffect } from 'react';
import { fetcher } from '@/lib/api';
import Link from 'next/link';
import HeaderMin from '@/app/admin/components/header-min';
import FormPost from '@/app/admin/components/forms/form-post';

interface Props {
    params: {
        id: number,
        postId: number
    };
}

interface DataPosts {
    id: number,
    attributes: {
        title: string,
        description: string,
        link: string,
        markupWithBackground: boolean,
        publishedAt: string,
        author: {
            data: {
                id: number
            }
        },
        work_type: {
            data: {
                id: number,
                attributes: {
                    name: string
                }
            }
        },
        photo: {
            data: {
                id: number,
                attributes: {
                    name: string,
                    width: number,
                    height: number,
                    url: string
                }
            }
        },
        file: {
            data: {
                id: number;
                attributes: {
                    name: string;
                    url: string;
                };
            };
        }
    }
}

const EditPage = ({params: {id, postId}}: Props) => {

    const [post, setPost] = useState<DataPosts>();

    useEffect(() => {
        const fetchData = async () => {
            const postResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/works/${postId}?populate=*`); 
            setPost(postResponse.data);
        };

        fetchData()
    }, []);

    return (
        <div>
            <HeaderMin title='Редактировать'/>
            <div className='flex flex-col w-full box-border'>
                {post &&
                    <FormPost 
                        title={post?.attributes?.title}
                        photo={post?.attributes?.photo?.data?.attributes?.url}
                        link={post?.attributes.link}
                        description={post?.attributes.description}
                        work_type={post.attributes.work_type.data.attributes.name}
                        markupWithBackground={post?.attributes.markupWithBackground}
                        file={post?.attributes.file?.data?.attributes?.url}
                    />
                }
                <div className='flex justify-end pt-5 max-[1200px]:justify-start'>
                    <Link href={`/admin/portfolioes/${id}`}>
                    <div className='w-full flex justify-center pt-12'>
                        <button className="
                                w-48 
                                bg-white
                                h-11 
                                border 
                                rounded-[4px] 
                                border-gray-500 
                                font-semibold 
                                text-base 
                                text-black 
                                hover:bg-black 
                                hover:text-white 
                                transition-all">
                                    Сохранить
                        </button>
                    </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default EditPage
