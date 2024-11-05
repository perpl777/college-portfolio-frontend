'use client'
import React, { useEffect, useState, useMemo } from 'react';
import {fetcher} from "@/lib/api"
import { getAuthData } from '@/lib/auth';
import Cookies from 'js-cookie';
import Header from "../components/header";
import UnpublishedPosts from '../components/posts/unpublished-posts';
import UnpublishedProfiles from '../components/students/unpublished-profiles';
import SliderWithoutCheckbox from '../components/slider-without-checkbox/slider-without-checkbox';

import qs from 'qs';

interface userInfoProps {
    convergences?: {
        name: string;
        course: any;
        full_name: string;
    }[]
    student: {
        name: string
    }
    role: {
        name: string
    }
}

interface StudentsProps {
    data: DataStudents[] | undefined
}

interface DataStudents {
    id: number;
    attributes: {
        surname: string;
        name: string;
        patronymic: string;
        published: boolean;
        convergence?: {
            data: {
                id: number;
                attributes: {
                    name: string;
                    course: any;
                    full_name: string;
                }
            }
        }
        posts: {
            data: {
                id: number;
            }
        }
    };
}

interface PostsProps {
    data: DataPosts[]
}

interface DataPosts {
    id: number,
    attributes: {
        student: {
            data: {
                id: number
            }
        }
    }
}

export default function ModerationPage() {
    const { id } = getAuthData();
    const [user, setUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState<userInfoProps>();

    const [activeButton, setActiveButton] = useState<number>(0);
    const [selectedBtn, setSelectedBtn] = useState<string>('Профили');
    const values = ['Профили', 'Работы']

    const [unpublishedStudents, setUnpublishedStudents] = useState<StudentsProps>();
    const [unpublishedPosts, setUnpublishedPosts] = useState<PostsProps>();
    
    useEffect(() => {
        const userInfo = Cookies.get('email');
        if (userInfo) {
            setUser(userInfo);
        }
        setLoading(false);
    }, []);

    useEffect(() => {     
        const fetchData = async () => {     
            const userInfoResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/${id}?populate=convergences,role,student`);
            setUserInfo(userInfoResponse) // info moderator
        };
        fetchData();   
    }, [id]);

    useEffect(() => {
        const fetchData = async () => {
            if (userInfo && userInfo.convergences) {
                const convergenceNames = userInfo.convergences.map((convergence: any) => convergence.name);
                
                const queryStudent = qs.stringify({
                    filters: {
                        published: {
                            $eq: false
                        },
                        convergence: {
                            name: {
                                $in: convergenceNames
                            }
                        }
                    },
                    pagination: {
                        start: 0,
                        limit: 25000
                    },
                    populate: '*'
                }, { encodeValuesOnly: true });
                const unpublishedStudentsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/students?${queryStudent}`);
                setUnpublishedStudents(unpublishedStudentsResponse.data); // unpublishedStudents

                const queryPost = qs.stringify({
                    filters: {
                        published: {
                            $eq: false
                        },
                        student: {
                            convergence: {
                                name: {
                                    $in: convergenceNames
                                }
                            }
                        }
                    },
                    pagination: {
                        start: 0,
                        limit: 25000
                    },
                    populate: '*'
                }, { encodeValuesOnly: true });
                const unpublishedPostsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/posts?${queryPost}`);
                setUnpublishedPosts(unpublishedPostsResponse.data);
            }
        };
    
        if (userInfo) {
            fetchData();
        }
    }, [userInfo]);
    
    
    
    const handleCategoryClick = (index: number, value: string) => {
        setActiveButton(index);
        setSelectedBtn(value);
    };

    return (
        <>
        { user && 
            <>
            { userInfo?.role.name === "Moderator" &&
                <div>
                    <Header />
                    <div className="flex justify-between flex-wrap gap-12 lg:flex-nowrap px-11 pt-16 pb-10 max-sm:pt-10 max-sm:pb-2 max-sm:px-4">
                        <SliderWithoutCheckbox values={values} handleCategoryClick={handleCategoryClick} activeButton={activeButton}/>
                    </div>
                    { selectedBtn === "Профили" 
                    ?
                        <UnpublishedProfiles filteredStudents={unpublishedStudents}/>
                    :
                        <UnpublishedPosts filteredPosts={unpublishedPosts}/>
                    }
                </div>
            }
            </>
        }
        </>
    );
}