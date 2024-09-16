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
        },
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
    const [blobPhoto, setBlobPhoto] = useState<Blob | null>(null);
    const [blobFile, setBlobFile] = useState<Blob | null>(null);
    const [fileLoaded, setFileLoaded] = useState(false);

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
                            photo={blobPhoto ? URL.createObjectURL(blobPhoto) : ''}
                            file={fileLoaded ? blobFile ? URL.createObjectURL(blobFile) : '' : null}
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