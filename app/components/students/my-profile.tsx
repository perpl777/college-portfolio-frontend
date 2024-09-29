'use client'
import React, { useState, useEffect, Suspense } from 'react';
import { getAuthData } from '@/lib/auth';
import Loading from '@/app/loading'
import { fetcher } from '@/lib/api';
import FormProfileNewStudent from "../form-inputs/form-inputs-profile/form-profile-new-student";
import FormProfileEditStudent from '../form-inputs/form-inputs-profile/form-profile-edit-student';


interface UserProps {
    student: {
        name: string
        id: number
    }
}


export default function MyProfile() {

    const { id } = getAuthData();
    const [user, setUser] = useState<UserProps>();

    useEffect(() => {     
        const fetchData = async () => {     
            const userDataResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/${id}?populate=*`);
            setUser(userDataResponse)
        };
        fetchData();   
    }, []);

    return (
        <div>
            { user?.student != null ? (
                <Suspense fallback={<Loading />}>
                    <FormProfileEditStudent studentId={user.student?.id}/>
                </Suspense>
                ) : (
                <FormProfileNewStudent />
            )}
        </div>
    );
}