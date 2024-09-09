'use client'
import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { fetcher } from '@/lib/api';
import { getAuthData } from '@/lib/auth';

import ImagePost from './image-post';
import Loading from '../../loading';
import BtnAddPost from '../btns/add-post-btn';
import ErrorMess from '../errorMess';


interface PostsProps {
    data: DataPosts[]
}


interface DataPosts {
    id: number,
    attributes: {
        title: string,
        url_view: string;
        worktype: {
            data: {
                id: number,
                attributes: {
                    name: string
                }
            }
        };
    }
}

interface UserProps {
    student: {
        name: string
        id: number
    }
}


export default function MyPosts() {

    const { id } = getAuthData();
    const [user, setUser] = useState<UserProps>();
    const [posts, setPosts] = useState<PostsProps>();
    const [error, setError] = useState<string>();
    const [checkProfile, setCheckProfile] = useState<boolean>(false);

    //фетчи
    useEffect(() => {
        const fetchData = async () => {
            const userDataResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/${id}?populate=*`);
            setUser(userDataResponse)
            
            if (userDataResponse?.student?.id) {
                const postsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/posts?filters[student][id][$eq]=${userDataResponse.student.id}&populate=*`);    
                setPosts(postsResponse);
                setCheckProfile(true)
            }
        }
    fetchData();
    }, []);

    //фильтры для постов
    const filteredPosts = useMemo(() => {
        if (!posts) return [];
        let filteredData = posts.data;
        return filteredData;
    }, [posts]);


    return (
        <div>  
            <div className='w-1/4 max-sm:w-full m-auto'>
                {error && <ErrorMess text='Сначала заполните профиль'/>}
            </div>
            <div className='grid grid-cols-3 gap-4 max-sm:gap-6 max-xl:grid-cols-2 max-sm:grid-cols-1'>
                <BtnAddPost id={id} user={user} setError={setError} checkProfile={checkProfile}/>
                {filteredPosts && filteredPosts.length > 0 && filteredPosts.map((post: any) => {
                    return (
                        <Suspense fallback={<Loading />}>
                            <ImagePost 
                                href={`/myprofile/edit-post`}
                                studentId={post.attributes.student.data.id}
                                postId={post.id}
                                url_view={post.attributes.url_view} 
                                title={post.attributes.title}
                            />
                        </Suspense>
                    )
                })}
            </div>
        </div>
    );
}