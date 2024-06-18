'use client'
import React, { useState, useEffect } from 'react';
import { fetcher } from '@/lib/api';
import PostPage from './post-page';


interface Props {
    params: {
        id: number,
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


export default function Post({ params: { id, postId}}: Props) {

    const [post, setPost] = useState<DataPosts>();

    useEffect(() => {
        const fetchData = async () => {
            let postsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/posts/${postId}?populate=*`);    
            setPost(postsResponse.data);
        };     
        fetchData();   
    }, []);

    return (
        <>
            {post && 
                <>
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
                </>
            }
        </>
    );
}