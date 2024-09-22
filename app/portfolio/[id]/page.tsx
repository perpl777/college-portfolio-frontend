'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { fetcher } from '@/lib/api';

import Header from '@/app/components/header';
import SliderWithCheckbox from '@/app/components/slider-with-checkbox/slider-with-checkbox';
import StudentCard from '@/app/components/students/student-card';
import Posts from '@/app/components/posts/posts';
import Search from '@/app/components/search';


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
        photo?: {
            data: {
                id: number,
                attributes: {
                    name: string,
                    url: string
                }
            }
        },
    }
}


interface DataPosts {
    id: number,
    attributes: {
        title: string,
        description?: string,
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
    const [blob, setBlob] = useState<Blob | null>(null);
    const [filteredPost, setFilteredPost] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('');
    const [tagsNames, setTagsNames] = useState<string[]>([]); 
    const [worktypes, setWorktypes] = useState<string[]>([]);
    const [checkboxChecked, setCheckboxChecked] = useState<boolean>(true);
    const [technologiesString, setTechnologiesString] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const [postsResponse, studentResponse, worktypesResponse] = await Promise.all([
                fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/posts?filters[student][id][$eq]=${id}&filters[published][$eq]=true&populate=*`),
                fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/students/${id}?populate=*`),
                fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/worktypes`),
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

    useEffect(() => {
        const fetchPhoto = async () => {             
            if (student?.attributes?.photo?.data?.attributes?.url) 
                {
                    const response = fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL_LOAD_FILES}${student?.attributes?.photo.data?.attributes?.url}`);
                    response.then(resp => resp.blob())
                    .then(fetchedBlob => setBlob(fetchedBlob));        
                }         
            };
        fetchPhoto();     
    }, [student?.attributes?.photo?.data?.attributes?.url])

    const filteredPosts = useMemo(() => {
        if (!posts) return [];
        let filteredData = posts.data;
        if (filteredPost) {
            filteredData = filteredData.filter(post => post.attributes.worktype.data.attributes.name === filteredPost
            );
        }

      // Поиск по тегам
        if (searchQuery) {
            const searchResults = filteredData.filter((post: any) =>
                post.attributes.tags.data.some((tag: any) =>
                    tag.attributes.name.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            filteredData = searchResults;
        }

        return filteredData;
    }, [posts, filteredPost, checkboxChecked, searchQuery]);    


    return (
    <>
        {student?.attributes.published &&
            <div className="flex flex-col">
                <Header />
                
                <div className="pt-20 max-lg:m-auto p-11 max-lg:pt-11 max-lg:px-4">
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
                            photo={blob ? URL.createObjectURL(blob) : ''}
                        /> 
                    }
                </div>

                <div className="flex justify-end pt-14 pb-20 px-11 font-light text-xl max-lg:text-lg max-lg:px-6 max-lg:pt-2 max-lg:pb-10">
                    <div className='w-4/6 max-[480px]:w-10/12 text-overflow-ellipsis'>
                        {student?.attributes?.about_info}
                    </div>
                </div>

                <div className="flex max-lg:flex-col justify-between px-11 pb-4 max-sm:pb-8 max-sm:px-4">
                    <SliderWithCheckbox values={worktypes} setSelectedCategory={setFilteredPost} setCheckboxChecked={setCheckboxChecked} checkboxChecked={checkboxChecked}/>
                    <Search setSearchQuery={setSearchQuery} placeholder='Поиск по тегам'></Search>
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