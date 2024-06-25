'use client'
import React, { useState, useEffect } from 'react';
import {getAuthData} from "@/lib/auth"
import {fetcher} from "@/lib/api"
import FormProfile from '../components/forms/form-profile';
import Menu from '../components/menu';

// пока что не понятно как сделаем базу о студентах и позьзователях
interface DataStudent {
    id: number,
    attributes: {
        surname: string,
        name: string,
        patronymic?: string;
        course: number,
        description: string,
        technologies: string,
        linkToGit?: string,
        linkToBehance?: string,
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
// пока типа 
interface UserData {
    student: DataStudent;
    //должен быть статус
}

const PersonalProfile = () => {

    // получаем данные о пользователе
    // это точно будет студент
    // и если это студент то он связан с таблицей со студентами
    const { id } = getAuthData();
    const { jwt } = getAuthData();
    let [userData, setUserData] = useState<UserData>();
    let [student, setStudent] = useState<DataStudent>();

    useEffect(() => {
        const fetchData = async () => {     
            const userDataResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/${id}?populate=*`);
            setUserData(userDataResponse)

            // исходя из этого как-то получаем данные о студенте
            let studentResponse = [];
            studentResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/students/${id}/?populate=*`);
            setStudent(studentResponse.data);
        };
        fetchData();   
    }, []);
    
    return (
            <div>
                <Menu />
                {/* если такой студент есть то  */}
                {student &&
                    <FormProfile 
                        surname={student.attributes.surname}
                        name={student.attributes.name}
                        patronymic={student.attributes.patronymic}
                        description={student.attributes.description}
                        course={student.attributes.course}
                        specialty={student.attributes.specialty}
                        technologies={student.attributes.technologies}
                        linkToGit={student.attributes.linkToGit}
                        linkToBehance={student.attributes.linkToBehance}
                        linkToVK={student.attributes.linkToVK}
                        profilePicture={student.attributes.profilePicture?.data?.attributes?.url}
                    />
                }
            </div>
    );
};

export default PersonalProfile;