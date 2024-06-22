'use client'
import React, { useState, useEffect } from 'react';
import { getAuthData } from '@/lib/auth';
import { fetcher } from '@/lib/api';
import FormProfileNewStudent from "../components/form-inputs/form-inputs-profile/form-profile-new-student";
import FormProfileEditStudent from '../components/form-inputs/form-inputs-profile/form-profile-edit-student';


interface UserProps {
    student: {
        name: string
        id: number
    }
}


export default function MyProfile() {

    const { id } = getAuthData();
    const [user, setUser] = useState<UserProps>();


    //фетч к юзеру
    useEffect(() => {     
        const fetchData = async () => {     
            const userDataResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/${id}?populate=*`);
            setUser(userDataResponse)
        };
        fetchData();   
    }, []);


    return (
        <div>
            { user?.student != null
            ?
            <FormProfileEditStudent studentId={user.student.id}/>
            :
            <FormProfileNewStudent />
            }
        </div>
    );
}