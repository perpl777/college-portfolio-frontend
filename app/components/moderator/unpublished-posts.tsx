'use client'
import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { fetcher } from '@/lib/api';
import Loading from '../../loading'

import ImagePost from '../../components/posts/image-post';


interface PostsProps {
    data: DataPosts[]
}

interface DataPosts {
    id: number,
    attributes: {
    title: string,
    url_view: string;
    published: boolean;
    student: {
        data: {
        id: number
        }
    }
    worktype: {
        data: {
        id: number,
        attributes: {
            name: string
        }
        }
    };
    tags: {
        data: {
        some(arg0: (tag: any) => boolean): unknown;
        id: number,
        attributes: {
            name: string
        }
        }
    }
    }
}

export default function UnpublishedPosts() {

    const [posts, setPosts] = useState<PostsProps>();

    //фетчи
    useEffect(() => {
        const fetchData = async () => {
            let postsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/posts?populate=worktype,tags,student&fields=title&fields=url_view&fields=published`);    
            setPosts(postsResponse);
        };     
        fetchData();   
    }, []);


    const filteredPosts = useMemo(() => {
        if (!posts) return [];
        let filteredData = posts.data?.filter((post: any) => { 
            return (post.attributes.published === false)
        });
        return filteredData;
    }, [posts]);


    return (
        <div className='px-11 pb-10 grid grid-cols-3 gap-4 max-sm:gap-6 max-sm:p-6 max-xl:grid-cols-2 max-sm:grid-cols-1'>
            {filteredPosts && filteredPosts.length > 0 && filteredPosts.map((post: any) => {
                return (
                    <Suspense fallback={<Loading />}>
                        <ImagePost 
                            href={`/moderation/post/${post?.id}`}
                            studentId={post.attributes.student.data.id}
                            postId={post.id}
                            url_view={post.attributes.url_view} 
                            title={post.attributes.title}
                        />
                    </Suspense>
                )
                })}
        </div>
    );
}