'use client'
import React, { useState, useEffect } from 'react';
import Post from './post';
import Link from 'next/link';
import { FaArrowUp } from 'react-icons/fa';


interface Props {
	posts: DataPosts[]
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
                id: number
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


const Posts = ({posts}: Props) => {

//для кнопки при скролле
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
                    <Link key={index} href={`/portfolio/${post?.attributes.student.data.id}/post/${post?.id}`}>
                        <Post
                            title={post.attributes.title}
                            background={post.attributes.background}
                            publishedAt={post.attributes.publishedAt}
                            worktype={post.attributes.worktype.data?.attributes?.name}
                            url_view={post?.attributes?.url_view}
                        />
                    </Link>
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