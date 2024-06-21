'use client'
import React, { useEffect, useState } from 'react';

import {fetcher} from "@/lib/api"

import { getAuthData } from '@/lib/auth';
import Cookies from 'js-cookie';

import PostPage from '../../../components/posts/post-page';
import Header from '@/app/components/header';
import Buttons from '@/app/components/accept-reject-btns';


interface Props {
    params: {
        postId: number
    }
}

interface DataPosts {
    id: number,
    attributes: {
        title: string,
        description?: string,
        urls_photos: string,
        url_view: string,
        url_file: string
        background: boolean,
        published: boolean,
        publishedAt: string,
        student: {
            data: {
                id: number;
                attributes: {
                    name: string
                }
            }
        },
        worktype: {
            data: {
                id: number,
                attributes: {
                    name: string
                }
            }
        },
        tags: {
            data: {
                id: number;
                attributes: {
                    name: string;
                };
            };
        }
    }
}

interface UserRoleProps {
    student: {
        name: string
    }
    role: {
        name: string
    }
}


export default function Post({ params: {postId}}: Props) {
    const { id } = getAuthData();
    const [user, setUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<UserRoleProps>();
    const [post, setPost] = useState<DataPosts>();

    //получение email user
    useEffect(() => {
        const userData = Cookies.get('email');
        if (userData) {
            setUser(userData);
        }
        setLoading(false);
    }, []);


    //фетч к юзеру
    useEffect(() => {     
        const fetchData = async () => {     
            const userDataResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/${id}?populate=*`);
            setUserRole(userDataResponse)
        };
        fetchData();   
    }, []);

    //фетч к постy
    useEffect(() => {
        const fetchData = async () => {
            let postsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/posts/${postId}?populate=*`);    
            setPost(postsResponse.data);
        };     
        fetchData();   
    }, []);


    return (
        <>
        { user && userRole?.role.name === "Moderator" &&
            <div className='pb-20'>
                <Header /> 
                <div className='mt-8 mb-12 border-y border-black max-sm:mb-10 max-sm:mt-8'>
                    {post &&
                        <PostPage
                            postId={postId}
                            title={post?.attributes.title}
                            description={post?.attributes.description}
                            publishedAt={post?.attributes.publishedAt}
                            worktype={post?.attributes.worktype.data.attributes.name}
                            url_view={post.attributes.url_view}
                            url_file={post.attributes.url_file}
                            studentName={post.attributes.student.data.attributes.name}
                            studentId={post.attributes.student.data.id}
                        />
                    }
                </div>
                <div className='flex justify-center'>
                    <Buttons />
                </div>
            </div>
        }
        </>
    );
}