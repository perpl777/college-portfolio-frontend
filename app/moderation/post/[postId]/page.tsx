'use client'
import React, { useEffect, useState } from 'react';

import {fetcher} from "@/lib/api"

import { getAuthData } from '@/lib/auth';
import Cookies from 'js-cookie';

import ErrorMess from '@/app/components/errorMess';
import PostPage from '../../../components/posts/post-page';
import Header from '@/app/components/header';
import Buttons from '@/app/components/btns/accept-reject-btns';


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
        photo: any,
        file: any,
        background: boolean,
        published?: boolean,
        publishedAt: string,
        student: {
            data: {
                id: number;
                attributes: {
                    name: string,
                    published: boolean
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
    const { jwt } = getAuthData();
    const [user, setUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<UserRoleProps>();
    
    const [post, setPost] = useState<DataPosts>();
    const [blobPhoto, setBlobPhoto] = useState<Blob | null>(null);
    const [blobFile, setBlobFile] = useState<Blob | null>(null);
    const [fileLoaded, setFileLoaded] = useState(false);

    const [error, setError] = useState<string | undefined>(undefined);


    //получение email user
    useEffect(() => {
        const userData = Cookies.get('email');
        if (userData) {
            setUser(userData);
        }
        setLoading(false);
    }, []);

    useEffect(() => {     
        const fetchData = async () => {     
            const userDataResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/${id}?populate=*`);
            setUserRole(userDataResponse)
        };
        fetchData();   
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            let postsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/posts/${postId}?populate=*`);    
            setPost(postsResponse.data);
        };     
        fetchData();   
    }, []);
    
    useEffect(() => {
        const fetchData = () => {
            fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/posts/${postId}?populate=*`)
                .then(postResponse => {
                    if (postResponse.data.attributes.photo && postResponse.data.attributes.photo.data && postResponse.data.attributes.photo.data.attributes.url) {
                        fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL_LOAD_FILES}${postResponse.data.attributes.photo.data.attributes.url}`)
                            .then(photoResponse => photoResponse.blob())
                            .then(fetchedBlobPhoto => {
                                setBlobPhoto(fetchedBlobPhoto);
                            });
                    }
    
                    if (postResponse.data.attributes.file && postResponse.data.attributes.file.data && postResponse.data.attributes.file.data.attributes.url) {
                        fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL_LOAD_FILES}${postResponse.data.attributes.file.data.attributes.url}`)
                            .then(fileResponse => fileResponse.blob())
                            .then(fetchedBlobFile => {
                                setBlobFile(fetchedBlobFile);
                                setFileLoaded(true);
                            });
                    }
    
                    setPost(postResponse.data);
                });
        };
        fetchData();
    }, []);

    const handleRejectPost = async () => {
        if (post?.attributes.student.data.attributes.published === false) {
            setError('Сначала проверьте профиль автора')
        }
        else {
            try {
                const response = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/posts/${postId}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        data: {
                            published: null
                        }
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`,
                    },
                });
                if (response.error) {
                    console.error('Error:', response.error);
                    return;
                }
                window.location.href = '/moderation';
            } 
            catch (error) {
                console.error('Error:', error);
            }
        }
    };

    const handlePublishPost = async () => {
        if (post?.attributes.student.data.attributes.published === false) {
            setError('Сначала проверьте профиль автора')
        }
        else {
            try {
                const response = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/posts/${postId}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        data: {
                            published: true
                        }
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`,
                    },
                });
                if (response.error) {
                    console.error('Error:', response.error);
                    return;
                }
                window.location.href = '/moderation';
            } 
            catch (error) {
                console.error('Error:', error);
            }
        }
    };

    return (
        <>
        { user && userRole?.role.name === "Moderator" &&
            <div className='pb-20'>
                <Header /> 
                <div className='mt-12 mb-14 border-y border-black max-sm:mt-8'>
                    {post &&
                        <PostPage
                            postId={postId}
                            title={post?.attributes.title}
                            description={post?.attributes.description}
                            publishedAt={post?.attributes.publishedAt}
                            worktype={post?.attributes.worktype.data.attributes.name}
                            photo={blobPhoto ? URL.createObjectURL(blobPhoto) : ''}
                            file={fileLoaded ? blobFile ? URL.createObjectURL(blobFile) : '' : undefined}
                            studentName={post.attributes.student.data.attributes.name}
                            studentId={post.attributes.student.data.id}
                        />
                    }
                </div>
                <div className='m-auto mb-6 w-1/3 max-sm:w-full'>
                    {error && <ErrorMess text={error}/>}
                </div>
                <div className='flex justify-center'>
                    <Buttons handleDelete={handleRejectPost} handlePublish={handlePublishPost}/>
                </div>
            </div>
        }
        </>
    );
}