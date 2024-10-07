'use client'
import React, { useEffect, useState, useMemo } from 'react';
import {fetcher} from "@/lib/api"
import { getAuthData } from '@/lib/auth';
import Cookies from 'js-cookie';
import Header from "../components/header";
import UnpublishedPosts from '../components/posts/unpublished-posts';
import UnpublishedProfiles from '../components/students/unpublished-profiles';
import SliderWithoutCheckbox from '../components/slider-without-checkbox/slider-without-checkbox';


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
        pubslished: boolean;
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

    const [students, setStudents] = useState<StudentsProps>();
    const [posts, setPosts] = useState<PostsProps>();
    
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
            setUserInfo(userInfoResponse)
        };
        fetchData();   
    }, []);

    useEffect(() => {     
        const fetchData = async () => {       
            const studentsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/students?populate=*&pagination[start]=0&pagination[limit]=2000`);
            setStudents(studentsResponse);  

            const postsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/posts?populate=*&pagination[start]=0&pagination[limit]=25000`);
            setPosts(postsResponse);
        };
        fetchData();   
    }, []);

    const filteredStudents = useMemo(() => {
        if (!students || !userInfo) return [];

    const convergenceNames = userInfo.convergences?.map((convergence: any) => convergence.name);
        const filteredData = students.data?.filter((student) =>
            convergenceNames?.some((convergenceName: any) =>
                student.attributes?.convergence?.data?.attributes?.name === convergenceName
            )
        );
        return filteredData;
    }, [students, userInfo]);
    
    const filteredStudentIds = useMemo(() => (
        filteredStudents?.map(student => student.id)
    ), [filteredStudents]);
    
    const filteredPosts = useMemo(() => {
        if (!posts) return [];
        return posts.data?.filter((post: any) => {
            return post.attributes.published === false && filteredStudentIds?.includes(post.attributes.student.data.id);
        });
    }, [posts, filteredStudentIds]);
    
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
                        <UnpublishedProfiles filteredStudents={filteredStudents}/>
                    :
                        <UnpublishedPosts filteredPosts={filteredPosts}/>
                    }
                </div>
            }
            </>
        }
        </>
    );
}