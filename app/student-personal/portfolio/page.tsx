'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { fetcher } from '@/lib/api';
import SliderMenu from '@/app/components/slider-menu';
import Posts from '@/app/components/posts/posts';
import TagsFilter from '@/app/components/tags-filter/small';

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
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const handleFiltersChange = (selectedFilters: string[]) => {
        setSelectedTags(selectedFilters);
        console.log(selectedFilters);
    };


    // это мы получим из бд
    const postsTypes = [
        'Все',
        'Проекты',
        'Достижения',
        'Курсы',
        'Стажировки',
        'Спорт',
        'Волонтерство'
    ]

    // тут мы получим конкретного студента и его фото
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

    // это для фото
    useEffect(() => {
        const fetchPhoto = async () => {             
            if (student?.attributes?.profilePicture.data?.attributes?.url) 
                {                 
                    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL_UPLOAD}${student?.attributes?.profilePicture.data?.attributes?.url}`);                 
                    const fetchedBlob = await response.blob();                 
                    setBlob(fetchedBlob);            
                }         
            };

        fetchPhoto();     
    }, [student?.attributes?.profilePicture.data?.attributes?.url])
    
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
        <div className="flex items-start px-11 pb-5 max-sm:pb-0 max-sm:px-4">
            <SliderMenu values={postsTypes} updateFilteredValues={setFilteredPostTypes}/>
            {/* фильтр по тегам как в гитхабе */}
            <div className="w-[12rem]">
                <TagsFilter onFiltersChange={handleFiltersChange} />
            </div>
        </div>

        {filteredPosts && filteredPosts.length > 0 
            ? (<Posts posts={filteredPosts} />) 
            : (<div className="text-center text-zinc-400 text-lg my-40">Здесь пока ничего нет</div>)
        }
    </div>
    );
}