'use client'
import React, { useState, useEffect } from 'react';
import { fetcher } from '@/lib/api';
import Loading from '@/app/loading';
import { Suspense } from 'react';
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
    const [fileLoaded, setFileLoaded] = useState(false);


    useEffect(() => {
        const fetchData = () => {
            fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/works/${postId}?populate=*`)
                .then(postResponse => {
                    if (postResponse.data.attributes.photo && postResponse.data.attributes.photo.data && postResponse.data.attributes.photo.data.attributes.url) {
                        fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL_UPLOAD}${postResponse.data.attributes.photo.data.attributes.url}`)
                            .then(photoResponse => photoResponse.blob())
                            .then(fetchedBlobPhoto => {
                                setBlobPhoto(fetchedBlobPhoto);
                            });
                    }
    
                    if (postResponse.data.attributes.file && postResponse.data.attributes.file.data && postResponse.data.attributes.file.data.attributes.url) {
                        fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL_UPLOAD}${postResponse.data.attributes.file.data.attributes.url}`)
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


    return (
        <>
            {post && 
                <>
                    <PostWindow
                        postId={postId}
                        title={post?.attributes.title}
                        description={post?.attributes.description}
                        link={post?.attributes.link}
                        publishedAt={post?.attributes.publishedAt}
                        work_type={post?.attributes.work_type.data.attributes.name}
                        photo={blobPhoto ? URL.createObjectURL(blobPhoto) : ''}
                        file={fileLoaded ? blobFile ? URL.createObjectURL(blobFile) : '' : null}
                    />
                </>
            }
        </>
    );
}