import React from 'react';
import { useState } from 'react';
import InputText from '../inputs/input-text';
import InputPhoto from '../inputs/input-photo';
import Textarea from '../inputs/textarea';
import FileInput from '../inputs/file-input';
import CheckDiploma from '../inputs/checkDiploma';
import Filter from '@/app/components/filter';

interface FormPostProps {
    title: string,
    photo: string;
    link: string,
    description: string,
    work_type: string,
    markupWithBackground: boolean,
    file: string,
}

const FormPost = ({ title, photo, link, description, work_type, markupWithBackground, file }: FormPostProps) => {

    return (
        <>
            <div className='flex justify-between max-[1200px]:flex-wrap'>
                <div className='flex pr-16 w-[600px] max-xl:w-[500px] flex-col max-[700px]:w-[400px]  max-[500px]:w-[300px]'>
                    <div className='mb-5 max-[500px]:mb-0'>
                        <InputText value={title} placeholder='Название..' disabled={false}/>
                    </div>
                    <div className='mb-5 max-[500px]:mb-0'>
                        <InputText value={link}  placeholder='Ссылка..' disabled={false}/>
                    </div>
                    <div className='mb-10 max-[500px]:mb-5'>
                        <Textarea value={description} placeholder='Описание..' />
                    </div>
                    <div className='mb-10 max-[500px]:mb-10'>
                        <FileInput value={file}/>
                    </div>
                </div>
                <div className=' w-[600px] flex flex-col max-xl:w-[500px]  items-end max-[700px]:w-[400px] max-[500px]:w-[300px]'>
                    <InputPhoto value={photo}/>
                    <div className='mb-10 max-[500px]:mb-5'>
                        <CheckDiploma value={markupWithBackground}/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FormPost;
