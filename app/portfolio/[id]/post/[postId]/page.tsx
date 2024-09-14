'use client'
import React, { useState, useEffect } from 'react';
import { fetcher } from '@/lib/api';
import PostPage from '../../../../components/posts/post-page';


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
        photo?: any,
        file: any;
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


export default function Post({ params: { id, postId}}: Props) {

    const [post, setPost] = useState<DataPosts>();

    //фетч
    useEffect(() => {
        const fetchData = async () => {
            let postsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/posts/${postId}?populate=*`);    
            setPost(postsResponse.data);
        };     
        fetchData();   
    }, []);


    return (
        <>
        {post?.attributes.published &&
            <>
                {post && 
                    <>
                        <PostPage
                            postId={postId}
                            title={post?.attributes.title}
                            description={post?.attributes.description}
                            publishedAt={post?.attributes.publishedAt}
                            worktype={post?.attributes.worktype.data.attributes.name}
                            photo={post.attributes.photo}
                            file={post.attributes.file}
                            studentName={post.attributes.student.data.attributes.name}
                            studentId={post.attributes.student.data.id}
                        />
                    </>
                }
            </>
            
        }
        </>
    );
}