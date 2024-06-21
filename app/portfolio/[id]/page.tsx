'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { fetcher } from '@/lib/api';

import Header from '@/app/components/header';
import SliderMenu from '@/app/components/slider-menu';
import StudentCard from '@/app/components/students/student-card';
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
        about_info: string,
        published: boolean,
        technologies: {
            data: {
                attributes: {
                    name: string
                }
            }
        },
        url_behance?: string,
        url_github?: string,
        url_vk?: string,
        specialization: {
            data: {
                attributes: {
                    name: string
                }
            }
        },
        url_photo?: string,
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
        published: boolean,
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

interface PostsProps {
    some: any;
    data: DataPosts[]
}


export default function Portfolio({ params: { id } }: Props) {
    let [student, setStudent] = useState<DataStudent>();
    const [posts, setPosts] = useState<PostsProps>();
    const [filteredPost, setFilteredPost] = useState<string | null>(null)
    const [worktypes, setWorktypes] = useState<string[]>([]);
    const [checkboxChecked, setCheckboxChecked] = useState<boolean>(true);
    const [technologiesString, setTechnologiesString] = useState("");

    //фетчи
    useEffect(() => {
        const fetchData = async () => {
            const [postsResponse, studentResponse, worktypesResponse] = await Promise.all([
                fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/posts?filters[student][id][$eq]=1&filters[published][$eq]=true&populate=*`),
                fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/students/${id}?populate=*`),
                fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/worktypes`)
            ]);

            setStudent(studentResponse.data);
            setPosts(postsResponse);

            const namesWorktypes = worktypesResponse.data.map((worktype: any) => worktype.attributes.name);   
            setWorktypes(namesWorktypes);

            if (studentResponse.data) {
                const technologies = studentResponse.data.attributes.technologies.data.map((tec: any) => tec.attributes ? tec.attributes.name : "");
                setTechnologiesString(technologies.join(", "));
            }
        
        };
    fetchData();
    }, []);


    //фильтры для постов
    const filteredPosts = useMemo(() => {
        if (!posts) return [];

        let filteredData = posts.data;
        
        // Фильтрация по типам
        if (filteredPost) {
            filteredData = filteredData.filter(post => post.attributes.worktype.data.attributes.name === filteredPost
            );
        }

        return filteredData;
    }, [posts, filteredPost, checkboxChecked]);


    return (
    <>
        {student?.attributes.published &&
            <div className="flex flex-col">
                <Header />
                
                <div className="pt-20 max-lg:m-auto p-11 max-lg:pt-11 max-lg:px-6">
                    {student &&
                        <StudentCard 
                            surname={student.attributes?.surname}
                            name={student.attributes?.name}
                            course={student.attributes?.course}
                            technologies={technologiesString}
                            url_behance={student.attributes?.url_behance}
                            url_github={student.attributes?.url_github}
                            url_vk={student.attributes?.url_vk}
                            specialization={student.attributes.specialization.data.attributes.name}
                            url_photo={student.attributes.url_photo}
                        /> 
                    }
                </div>

                <div className="flex justify-end pt-14 pb-20 px-11 font-light text-xl max-lg:text-lg max-lg:px-6 max-lg:pt-8">
                    <div className='w-4/6 max-[480px]:w-10/12 text-overflow-ellipsis'>
                        {student?.attributes?.about_info}
                    </div>
                </div>

                <div className="px-11 pb-4 max-sm:pb-1 max-sm:px-4">
                    <SliderMenu values={worktypes} setSelectedCategory={setFilteredPost} setCheckboxChecked={setCheckboxChecked} checkboxChecked={checkboxChecked}/>
                </div>

                {filteredPosts && filteredPosts.length > 0 
                    ? (<Posts posts={filteredPosts} />) 
                    : (<div className="text-center text-zinc-400 text-lg my-40">Здесь пока ничего нет</div>)
                }
            </div>
        }
        </>
    );
}