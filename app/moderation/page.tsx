'use client'

import React, { useEffect, useState, useMemo } from 'react';

import {fetcher} from "@/lib/api"

import { getAuthData } from '@/lib/auth';
import Cookies from 'js-cookie';
import Filter from '../components/filter'

import Header from "../components/header";
import UnpublishedPosts from '../components/posts/unpublished-posts';
import UnpublishedProfiles from '../components/students/unpublished-profiles';
import SliderWithoutCheckbox from '../components/slider-without-checkbox/slider-without-checkbox';


interface UserRoleProps {
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
        specialization: {
            data: {
                attributes: {
                    name: string
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
    const [userRole, setUserRole] = useState<UserRoleProps>();

    const [activeButton, setActiveButton] = useState<number>(0);
    const [selectedBtn, setSelectedBtn] = useState<string>('Профили');
    const values = ['Профили', 'Работы']

    const [students, setStudents] = useState<StudentsProps>();
    const [posts, setPosts] = useState<PostsProps>();
    const [filteredSpecialty, setFilteredSpecialty] = useState<string | null>(null);
    const specialty = [
        "Все специальности",
        "Информационные системы и программирование", 
        "Реклама", 
        "Дизайн", 
        "Графический дизайн", 
        "Коммерческий дизайн", 
        "Фотография",
        "Печатное дело", 
        "Издательское дело",
        "Издательское дело и реклама",
        "Изделия из бумаги и картона", 
    ]

    useEffect(() => {
        const userData = Cookies.get('email');
        if (userData) {
            setUser(userData);
        }
        setLoading(false);
    }, []);

    useEffect(() => {     
        const fetchData = async () => {     
            const userDataResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/${id}?populate=*`);
            setUserRole(userDataResponse)
        };
        fetchData();   
    }, []);

    useEffect(() => {     
        const fetchData = async () => {       
            const studentsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/students?populate=*`);
            setStudents(studentsResponse);  

            const postsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/posts?populate=*`);
            setPosts(postsResponse);
        };
        fetchData();   
    }, []);

    const filteredStudentsBySpecialization = useMemo(() => {
        if (!students) return [];
        let filteredData = students.data;
        if (filteredSpecialty) {
            filteredData = filteredData?.filter(student => student.attributes.specialization.data.attributes.name === filteredSpecialty);
        }
        return filteredData;
    }, [students, filteredSpecialty]);

    const filteredStudents = useMemo(() => {
        if (!students) return [];
        let filteredData = students.data?.filter((student: any) => { 
            return (student.attributes.published === false)
        });
        if (filteredSpecialty) {
            filteredData = filteredData?.filter(student => student.attributes.specialization.data.attributes.name === filteredSpecialty);
        }
        return filteredData;
    }, [students, filteredSpecialty]);

    const filteredStudentIds = useMemo(() => (
        filteredStudentsBySpecialization?.map(student => student.id)
    ), [filteredStudentsBySpecialization]);
    
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
            { userRole?.role.name === "Moderator" &&
                <div>
                    <Header />
                    <div className="flex justify-between flex-wrap gap-12 lg:flex-nowrap px-11 pt-12 pb-10 max-sm:pt-10 max-sm:pb-4 max-sm:px-6">
                        <SliderWithoutCheckbox values={values} handleCategoryClick={handleCategoryClick} activeButton={activeButton}/>
                        <Filter values={specialty} updateFilteredValues={setFilteredSpecialty} type={'rounden-lg'}/>
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