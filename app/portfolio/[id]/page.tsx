'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { fetcher } from '@/lib/api';
import Header from '@/app/components/header';
import MenuPosts from '@/app/components/posts/menu-post';
import StudentCard from '@/app/components/student-card';
import Posts from '@/app/components/posts/posts';


interface Props {
    params: {id: number};
}

interface DataStudent {
    id: number,
    attributes: {
        surname: string,
        name: string,
        course: number,
        description: string,
        technologies: string,
        linkToBehance?: string,
        linkToGit?: string,
        linkToVK?: string,
        specialty: string,
        profilePicture: {
            data: {
                id: number,
                attributes: {
                    name: string,
                    width: number,
                    height: number,
                    url: string
                }
            }
        }
    }
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

interface PostsProps {
    data: DataPosts[]
}


export default function Portfolio({ params: { id } }: Props) {

    let [student, setStudent] = useState<DataStudent>();
    const [posts, setPosts] = useState<PostsProps>();
    const [filteredPostType, setFilteredPostTypes] = useState<string | null>(null);
    const [blob, setBlob] = useState<Blob | null>(null);

    const postsTypes = [
        'Все',
        'Проекты',
        'Достижения',
        'Курсы',
        'Стажировки',
        'Спорт',
        'Волонтерство'
    ]

    useEffect(() => {
        const fetchData = async () => {
            let postsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/works?filters[author][id][$eq]=${id}&populate=*`);   
            const studentResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/students/${id}?populate=*`);
            // console.log(studentResponse)
            setStudent(studentResponse.data);
            setPosts(postsResponse);
        };
    fetchData();
    }, []);

    useEffect(() => {
        const fetchPhoto = async () => {
            if (student?.attributes?.profilePicture.data?.attributes?.url) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL_UPLOAD}${student?.attributes?.profilePicture.data?.attributes?.url}`);
                const fetchedBlob = await response.blob();
                setBlob(fetchedBlob);
            }
        };

        fetchPhoto();
    }, [student?.attributes?.profilePicture.data?.attributes?.url]);

    
    const filteredPosts = useMemo(() => {
        if (!posts) return [];
        let filteredData = posts.data;
        
        // Фильтрация по типам
        if (filteredPostType) {
            filteredData = filteredData.filter(post => post.attributes.work_type.data.attributes.name === filteredPostType);
        }
    
        return filteredData;
    }, [posts, filteredPostType]);


    return (
    <div className="flex flex-col">
        <Header />

        <div className="pt-20 max-lg:m-auto p-11 max-lg:pt-11 max-lg:px-6">
            {student &&
                <StudentCard 
                    surname={student.attributes?.surname}
                    name={student.attributes?.name}
                    course={student.attributes?.course}
                    description={student.attributes?.description}
                    technologies={student.attributes?.technologies}
                    linkToBehance={student.attributes?.linkToBehance}
                    linkToGit={student.attributes?.linkToGit}
                    linkToVK={student.attributes?.linkToVK}
                    specialty={student.attributes?.specialty}
                    profilePicture={blob ? URL.createObjectURL(blob) : ''}
                /> 
            }
        </div>

        <div className="flex justify-end pt-10 pb-16 px-11 font-light text-xl max-lg:text-lg max-lg:px-6 max-lg:pt-4 max-lg:pb-8 max-[480px]:justify-center">
            <div className='w-4/6 max-[480px]:w-full'>
                {student?.attributes?.description}
            </div>
        </div>

        <div className="px-11 pb-3 max-sm:pb-0 max-sm:pt-4 max-sm:px-8">
            <MenuPosts values={postsTypes} updateFilteredValues={setFilteredPostTypes}/>
        </div>

        {filteredPosts && filteredPosts.length > 0 
            ? (<Posts posts={filteredPosts} />) 
            : (<div className="text-center text-zinc-400 text-lg my-40">Здесь пока ничего нет</div>)
        }
    </div>
    );
}