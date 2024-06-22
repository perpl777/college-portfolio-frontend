'use client'
import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { fetcher } from '@/lib/api';

import ImagePost from '../components/posts/image-post';
import Loading from '../loading';


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


export default function MyPosts() {
    const [posts, setPosts] = useState<PostsProps>();
    const [filteredPost, setFilteredPost] = useState<string | null>(null)
    const [worktypes, setWorktypes] = useState<string[]>([]);
    const [checkboxChecked, setCheckboxChecked] = useState<boolean>(true);


    //фетчи
    useEffect(() => {
        const fetchData = async () => {
            let postsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/posts?filters[student][id][$eq]=${id}&populate=*`);    
            setPosts(postsResponse);
        }
    fetchData();
    }, []);


    //фильтры для постов
    const filteredPosts = useMemo(() => {
        if (!posts) return [];

        let filteredData = posts.data;
        
        // Фильтрация по типам
        if (filteredPost) {
            filteredData = filteredData.filter((post: any) => post.attributes.worktype.data.attributes.name === filteredPost
            );
        }

        return filteredData;
    }, [posts, filteredPost, checkboxChecked]);


    return (
        <>
            <div className='px-11 pb-10 grid grid-cols-3 gap-4 max-sm:gap-6 max-sm:p-6 max-xl:grid-cols-2 max-sm:grid-cols-1'>
                {filteredPosts && filteredPosts.length > 0 && filteredPosts.map((post: any) => {
                return (
                    <Suspense fallback={<Loading />}>
                        <ImagePost 
                            href={`/portfolio/${post.attributes.student.data.id}/post/${post.id}`}
                            studentId={post.attributes.student.data.id}
                            postId={post.id}
                            url_view={post.attributes.url_view} 
                            title={post.attributes.title}
                        />
                    </Suspense>
                )
                })}
            </div>
        </>
    );
}