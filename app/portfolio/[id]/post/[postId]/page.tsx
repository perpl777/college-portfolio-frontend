'use client'
import React, { useState, useEffect } from 'react';
import { fetcher } from '@/lib/api';
import PostWindow from './post';


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
        description: string,
        link?: string,
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
                    url: string
                }
            }
        },
        file?: {
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


export default function Post({ params: { id, postId}}: Props) {

    const [post, setPost] = useState<DataPosts>();
    const [blobPhoto, setBlobPhoto] = useState<Blob | null>(null);
    const [blobFile, setBlobFile] = useState<Blob | null>(null);


    useEffect(() => {
        const fetchData = async () => {
            const postResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/works/${postId}?populate=*`); 
            
            if (postResponse.data.attributes.photo && postResponse.data.attributes.photo.data && postResponse.data.attributes.photo.data.attributes.url) {
                const photoResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL_UPLOAD}${postResponse.data.attributes.photo.data.attributes.url}`);
                const fetchedBlobPhoto = await photoResponse.blob();
                setBlobPhoto(fetchedBlobPhoto);
            }
            
            if (postResponse.data.attributes.file && postResponse.data.attributes.file.data && postResponse.data.attributes.file.data.attributes.url) {
                const fileResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL_UPLOAD}${postResponse.data.attributes.file.data.attributes.url}`);
                const fetchedBlobFile = await fileResponse.blob();
                setBlobFile(fetchedBlobFile);
            }
            setPost(postResponse.data);
        };
        fetchData()
    }, []);


    return (
        <>
        {post && 
            <PostWindow
                postId={postId}
                title={post?.attributes.title}
                description={post?.attributes.description}
                link={post?.attributes.link}
                publishedAt={post?.attributes.publishedAt}
                work_type={post?.attributes.work_type.data.attributes.name}
                photo={blobPhoto ? URL.createObjectURL(blobPhoto) : ''}
                file={blobFile ? URL.createObjectURL(blobFile) : ''}
            />
        }
        </>
    );
}