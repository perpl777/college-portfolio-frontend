'use client'
import React, { useState, useEffect } from 'react';
import Post from './post';
import Link from 'next/link';
import { Suspense } from 'react';
import Loading from '@/app/loading';
import { FaArrowUp } from 'react-icons/fa';


interface Props {
	posts: DataPosts[]
}   

interface DataPosts {
    id: number,
    attributes: {
        title: string,
        description?: string,
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
        photo?: {
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

const Posts = ({posts}: Props) => {

    const [showButton, setShowButton] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > 1000) {
            setShowButton(true);
        } else {
            setShowButton(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div>
            {posts.map((post: any, index: number) => {
                return  (
                    <Suspense fallback={<Loading />}>
                        <Link key={index} href={`/portfolio/${post?.attributes.author.data.id}/post/${post?.id}`}>
                            <Post
                                title={post.attributes.title}
                                markupWithBackground={post.attributes.markupWithBackground}
                                publishedAt={post.attributes.publishedAt}
                                work_type={post.attributes.work_type.data?.attributes?.name}
                                photo={post?.attributes?.photo?.data?.attributes?.url}
                            />
                        </Link>
                    </Suspense>
                )
            })}

            {showButton && (
                <button 
                    className="fixed bottom-10 right-10 bg-gray-100 text-gray-500 rounded-full p-4 max-sm:p-2"
                    onClick={scrollToTop}>
                    <FaArrowUp />
                </button>
            )}
        </div>
    )
}

export default Posts